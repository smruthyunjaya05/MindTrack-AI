"""BERT Model Training Script for MindTrack AI (Phase 3)

This script fine-tunes DistilBERT for binary emotion classification with
optimizations specifically designed for 4GB GPU (NVIDIA RTX 2050).

Key Optimizations:
- DistilBERT (66M params) instead of BERT (110M params)
- Mixed precision training (FP16) - saves ~50% memory
- Batch size 8 with gradient accumulation 2 (effective batch 16)
- Max sequence length 128 tokens
- Gradient checkpointing enabled
- Regular GPU cache clearing

Expected Performance:
- Training time: 2-4 hours
- GPU memory: ~2.5-3.0 GB
- Target accuracy: ≥85%
- Target F1-score: ≥0.85
"""
import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    AdamW,
    get_linear_schedule_with_warmup
)
from sklearn.metrics import accuracy_score, f1_score, classification_report
from tqdm import tqdm
import os
import json
from datetime import datetime

# Check GPU availability
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print("="*70)
print("MINDTRACK AI - BERT MODEL TRAINING (PHASE 3)")
print("="*70)
print(f"\n🔧 Device: {device}")
if torch.cuda.is_available():
    print(f"🎮 GPU: {torch.cuda.get_device_name(0)}")
    print(f"💾 GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    print(f"🔥 CUDA Version: {torch.version.cuda}")
    # Clear any cached memory
    torch.cuda.empty_cache()
else:
    print("⚠️  WARNING: No GPU detected! Training will be very slow.")
    print("   Consider using Google Colab with GPU for faster training.")

# Training configuration (optimized for 4GB GPU)
TRAINING_CONFIG = {
    'model_name': 'distilbert-base-uncased',  # RECOMMENDED for 4GB GPU
    'learning_rate': 2e-5,
    'epochs': 4,
    'batch_size': 8,                          # Reduced for 4GB GPU
    'gradient_accumulation_steps': 2,         # Simulates batch size 16
    'max_length': 128,                        # Optimal for 4GB GPU
    'warmup_ratio': 0.1,
    'weight_decay': 0.01,
    'max_grad_norm': 1.0,
    'fp16': torch.cuda.is_available(),        # CRITICAL: Mixed precision
    'logging_steps': 100,
    'eval_steps': 500,
    'save_steps': 500,
    'seed': 42
}

print(f"\n📋 Training Configuration:")
for key, value in TRAINING_CONFIG.items():
    print(f"   {key}: {value}")
print()

# Set random seeds for reproducibility
torch.manual_seed(TRAINING_CONFIG['seed'])
np.random.seed(TRAINING_CONFIG['seed'])
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(TRAINING_CONFIG['seed'])


class EmotionDataset(Dataset):
    """Custom dataset for emotion classification"""
    
    def __init__(self, texts, labels, tokenizer, max_length=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        # Tokenize
        encoding = self.tokenizer(
            text,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.float)
        }


def load_data():
    """Load preprocessed train and validation datasets"""
    print("="*70)
    print("LOADING DATA")
    print("="*70)
    
    try:
        train_df = pd.read_csv('../data/processed/train.csv')
        val_df = pd.read_csv('../data/processed/validation.csv')
        
        print(f"✓ Training samples: {len(train_df):,}")
        print(f"✓ Validation samples: {len(val_df):,}")
        
        # Check label distribution
        print(f"\n📊 Training set label distribution:")
        train_counts = train_df['label'].value_counts()
        for label, count in train_counts.items():
            pct = (count / len(train_df)) * 100
            label_name = "Normal" if label == 0 else "Stressed/Depressed"
            print(f"   {label_name} ({label}): {count:,} ({pct:.1f}%)")
        
        return train_df, val_df
    
    except FileNotFoundError as e:
        print(f"❌ Error: Could not find processed data files.")
        print(f"   Please run data_preparation.py first (Phase 2)")
        raise e


def create_data_loaders(train_df, val_df, tokenizer, batch_size):
    """Create PyTorch DataLoaders"""
    print(f"\n📦 Creating DataLoaders (batch_size={batch_size})...")
    
    # Extract features and labels
    X_train = train_df['text'].values
    y_train = train_df['label'].values
    X_val = val_df['text'].values
    y_val = val_df['label'].values
    
    # Create datasets
    train_dataset = EmotionDataset(X_train, y_train, tokenizer, TRAINING_CONFIG['max_length'])
    val_dataset = EmotionDataset(X_val, y_val, tokenizer, TRAINING_CONFIG['max_length'])
    
    # Create dataloaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    print(f"✓ Train batches: {len(train_loader)}")
    print(f"✓ Validation batches: {len(val_loader)}")
    
    return train_loader, val_loader


def train_epoch(model, train_loader, optimizer, scheduler, scaler, epoch, config):
    """Train for one epoch"""
    model.train()
    total_loss = 0
    optimizer.zero_grad()
    
    progress_bar = tqdm(train_loader, desc=f'Epoch {epoch+1}/{config["epochs"]}')
    
    for step, batch in enumerate(progress_bar):
        # Move batch to device
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels'].to(device)
        
        # Mixed precision forward pass
        if config['fp16']:
            with torch.cuda.amp.autocast():
                outputs = model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=labels
                )
                loss = outputs.loss / config['gradient_accumulation_steps']
            
            # Backward pass with gradient scaling
            scaler.scale(loss).backward()
        else:
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels
            )
            loss = outputs.loss / config['gradient_accumulation_steps']
            loss.backward()
        
        # Update weights every gradient_accumulation_steps
        if (step + 1) % config['gradient_accumulation_steps'] == 0:
            if config['fp16']:
                scaler.unscale_(optimizer)
                torch.nn.utils.clip_grad_norm_(model.parameters(), config['max_grad_norm'])
                scaler.step(optimizer)
                scaler.update()
            else:
                torch.nn.utils.clip_grad_norm_(model.parameters(), config['max_grad_norm'])
                optimizer.step()
            
            scheduler.step()
            optimizer.zero_grad()
        
        total_loss += loss.item() * config['gradient_accumulation_steps']
        progress_bar.set_postfix({'loss': loss.item() * config['gradient_accumulation_steps']})
        
        # Clear GPU cache periodically
        if step % 50 == 0 and torch.cuda.is_available():
            torch.cuda.empty_cache()
    
    avg_loss = total_loss / len(train_loader)
    return avg_loss


def evaluate(model, val_loader, config):
    """Evaluate model on validation set"""
    model.eval()
    predictions = []
    true_labels = []
    total_loss = 0
    
    with torch.no_grad():
        for batch in tqdm(val_loader, desc='Evaluating'):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            # Forward pass with mixed precision
            if config['fp16']:
                with torch.cuda.amp.autocast():
                    outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            else:
                outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            
            loss = outputs.loss
            logits = outputs.logits
            
            # Get predictions
            probs = torch.sigmoid(logits).cpu().numpy().flatten()
            preds = (probs > 0.5).astype(int)
            
            predictions.extend(preds)
            true_labels.extend(labels.cpu().numpy())
            total_loss += loss.item()
            
            # Clear GPU cache
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
    
    # Calculate metrics
    accuracy = accuracy_score(true_labels, predictions)
    f1 = f1_score(true_labels, predictions, average='binary')
    avg_loss = total_loss / len(val_loader)
    
    return accuracy, f1, avg_loss


def main():
    """Main training pipeline"""
    
    # Load data
    train_df, val_df = load_data()
    
    # Initialize tokenizer and model
    print(f"\n{'='*70}")
    print("INITIALIZING MODEL")
    print("="*70)
    print(f"Loading {TRAINING_CONFIG['model_name']}...")
    
    tokenizer = DistilBertTokenizer.from_pretrained(TRAINING_CONFIG['model_name'])
    model = DistilBertForSequenceClassification.from_pretrained(
        TRAINING_CONFIG['model_name'],
        num_labels=1,              # Binary classification with sigmoid
        output_attentions=True,    # For explainability (optional)
        output_hidden_states=False
    )
    
    # Enable gradient checkpointing (saves memory)
    model.gradient_checkpointing_enable()
    model.to(device)
    
    num_params = sum(p.numel() for p in model.parameters()) / 1e6
    print(f"✓ Model loaded: {num_params:.1f}M parameters")
    print(f"✓ Gradient checkpointing: Enabled")
    
    # Create data loaders
    train_loader, val_loader = create_data_loaders(
        train_df, val_df, tokenizer, TRAINING_CONFIG['batch_size']
    )
    
    # Setup optimizer and scheduler
    print(f"\n📊 Setting up optimizer and scheduler...")
    optimizer = AdamW(
        model.parameters(),
        lr=TRAINING_CONFIG['learning_rate'],
        eps=1e-8,
        weight_decay=TRAINING_CONFIG['weight_decay']
    )
    
    total_steps = (len(train_loader) // TRAINING_CONFIG['gradient_accumulation_steps']) * TRAINING_CONFIG['epochs']
    warmup_steps = int(total_steps * TRAINING_CONFIG['warmup_ratio'])
    
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=warmup_steps,
        num_training_steps=total_steps
    )
    
    # Initialize mixed precision scaler
    scaler = torch.cuda.amp.GradScaler() if TRAINING_CONFIG['fp16'] else None
    
    print(f"✓ Optimizer: AdamW (lr={TRAINING_CONFIG['learning_rate']})")
    print(f"✓ Scheduler: Linear with warmup ({warmup_steps} steps)")
    print(f"✓ Mixed precision (FP16): {TRAINING_CONFIG['fp16']}")
    
    # Training loop
    print(f"\n{'='*70}")
    print("TRAINING")
    print("="*70)
    print(f"🚀 Starting training for {TRAINING_CONFIG['epochs']} epochs...")
    print(f"⏱️  Estimated time: 2-4 hours\n")
    
    best_f1 = 0
    training_history = []
    
    start_time = datetime.now()
    
    for epoch in range(TRAINING_CONFIG['epochs']):
        print(f"\n{'─'*70}")
        print(f"EPOCH {epoch+1}/{TRAINING_CONFIG['epochs']}")
        print(f"{'─'*70}")
        
        # Train
        train_loss = train_epoch(model, train_loader, optimizer, scheduler, scaler, epoch, TRAINING_CONFIG)
        
        # Evaluate
        val_accuracy, val_f1, val_loss = evaluate(model, val_loader, TRAINING_CONFIG)
        
        # Log results
        print(f"\n📊 Epoch {epoch+1} Results:")
        print(f"   Train Loss: {train_loss:.4f}")
        print(f"   Val Loss:   {val_loss:.4f}")
        print(f"   Val Accuracy: {val_accuracy:.4f} (Target: ≥0.85)")
        print(f"   Val F1-Score: {val_f1:.4f} (Target: ≥0.85)")
        
        # Save history
        training_history.append({
            'epoch': epoch + 1,
            'train_loss': float(train_loss),
            'val_loss': float(val_loss),
            'val_accuracy': float(val_accuracy),
            'val_f1': float(val_f1)
        })
        
        # Save best model
        if val_f1 > best_f1:
            best_f1 = val_f1
            print(f"   🎯 New best F1-score: {best_f1:.4f} - Saving model...")
            
            # Create models directory
            os.makedirs('../data/models', exist_ok=True)
            model_path = '../data/models/distilbert_emotion_model'
            
            # Save model and tokenizer
            model.save_pretrained(model_path)
            tokenizer.save_pretrained(model_path)
            
            print(f"   ✓ Model saved to {model_path}")
        
        # Clear GPU cache
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
    
    end_time = datetime.now()
    duration = end_time - start_time
    
    # Final summary
    print(f"\n{'='*70}")
    print("TRAINING COMPLETE")
    print("="*70)
    print(f"⏱️  Total training time: {duration}")
    print(f"🎯 Best validation F1-score: {best_f1:.4f}")
    print(f"📁 Model saved to: data/models/distilbert_emotion_model")
    
    # Save training history
    history_path = '../data/models/training_history.json'
    with open(history_path, 'w') as f:
        json.dump({
            'config': TRAINING_CONFIG,
            'best_f1': float(best_f1),
            'training_duration': str(duration),
            'history': training_history
        }, f, indent=2)
    
    print(f"📊 Training history saved to: {history_path}")
    
    # GPU memory summary
    if torch.cuda.is_available():
        max_memory = torch.cuda.max_memory_allocated() / 1e9
        cached_memory = torch.cuda.max_memory_reserved() / 1e9
        print(f"\n💾 GPU Memory Usage:")
        print(f"   Peak allocated: {max_memory:.2f} GB")
        print(f"   Peak cached: {cached_memory:.2f} GB")
    
    print(f"\n✅ Ready for Phase 4: Model Evaluation")
    print("="*70)


if __name__ == "__main__":
    main()
