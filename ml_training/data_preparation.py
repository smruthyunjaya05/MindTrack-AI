"""Data Preparation Script for MindTrack AI (Phase 2)

This script loads three datasets, performs minimal preprocessing for BERT,
creates a combined dataset with binary labels, and splits into train/val/test sets.

Datasets:
1. Sentiment140 (Twitter) - 1.6M tweets
2. Suicide Watch (Reddit) - 20K posts  
3. Mental Health (Facebook) - 7K posts

Output:
- data/processed/combined_dataset.csv
- data/processed/train.csv
- data/processed/validation.csv
- data/processed/test.csv
"""
import pandas as pd
import numpy as np
import re
from sklearn.model_selection import train_test_split
import os

# Minimal preprocessing for BERT (preserves context)
def minimal_preprocess(text):
    """Minimal preprocessing - BERT handles most tokenization internally"""
    if pd.isna(text):
        return None
    
    text = str(text)
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Remove very short texts (less than 10 characters)
    if len(text) < 10:
        return None
    
    return text


def load_sentiment140(sample_size=100000):
    """Load Sentiment140 dataset and map labels to binary
    
    Original labels: 0=negative, 2=neutral, 4=positive
    Mapped labels: 0→1 (stressed), 2→0 (normal), 4→0 (normal)
    """
    print("\n1. Loading Sentiment140 dataset...")
    
    file_path = '../data/training.1600000.processed.noemoticon.csv'
    
    # Sentiment140 has no header
    column_names = ['label', 'id', 'date', 'query', 'user', 'text']
    
    try:
        df = pd.read_csv(file_path, encoding='latin-1', names=column_names)
        print(f"   ✓ Loaded {len(df):,} tweets")
        
        # Extract only text and label columns
        df = df[['text', 'label']]
        
        # Map labels: 0→1 (negative→stressed), 2→0, 4→0 (positive/neutral→normal)
        label_map = {0: 1, 2: 0, 4: 0}
        df['label'] = df['label'].map(label_map)
        
        # Sample to reduce dataset size
        if sample_size and len(df) > sample_size:
            df = df.sample(n=sample_size, random_state=42)
            print(f"   ✓ Sampled {sample_size:,} tweets for training efficiency")
        
        # Preprocess
        df['text'] = df['text'].apply(minimal_preprocess)
        df = df.dropna(subset=['text'])
        
        # Add source
        df['source'] = 'sentiment140'
        
        print(f"   ✓ After preprocessing: {len(df):,} samples")
        print(f"   Label distribution: {df['label'].value_counts().to_dict()}")
        
        return df
    
    except Exception as e:
        print(f"   ✗ Error loading Sentiment140: {e}")
        return pd.DataFrame()


def load_suicide_detection():
    """Load Suicide Watch dataset
    
    Labels: 0=Normal, 1=Depressed/Suicidal (already binary)
    """
    print("\n2. Loading Suicide Watch (Reddit) dataset...")
    
    file_path = '../data/Suicide_Detection.csv'
    
    try:
        df = pd.read_csv(file_path)
        print(f"   ✓ Loaded {len(df):,} posts")
        
        # Ensure columns are text and label
        if 'text' not in df.columns:
            # Sometimes the column might be named differently
            text_col = [col for col in df.columns if col.lower() in ['text', 'post', 'content']][0]
            df = df.rename(columns={text_col: 'text'})
        
        if 'label' not in df.columns:
            label_col = [col for col in df.columns if col.lower() in ['label', 'class', 'target']][0]
            df = df.rename(columns={label_col: 'label'})
        
        df = df[['text', 'label']]
        
        # Map string labels to binary if needed
        if df['label'].dtype == 'object':
            # Map 'suicide' or 'depressed' to 1, others to 0
            label_map = {}
            unique_labels = df['label'].unique()
            for lbl in unique_labels:
                lbl_lower = str(lbl).lower()
                if 'suicide' in lbl_lower or 'depress' in lbl_lower:
                    label_map[lbl] = 1
                else:
                    label_map[lbl] = 0
            df['label'] = df['label'].map(label_map)
        
        # Ensure label is integer
        df['label'] = df['label'].astype(int)
        
        # Preprocess
        df['text'] = df['text'].apply(minimal_preprocess)
        df = df.dropna(subset=['text'])
        
        # Add source
        df['source'] = 'reddit'
        
        print(f"   ✓ After preprocessing: {len(df):,} samples")
        print(f"   Label distribution: {df['label'].value_counts().to_dict()}")
        
        return df
    
    except Exception as e:
        print(f"   ✗ Error loading Suicide Watch: {e}")
        return pd.DataFrame()


def load_mental_health():
    """Load Facebook Mental Health dataset
    
    Labels: 0=Normal, 1=Anxiety/Depression (already binary)
    """
    print("\n3. Loading Mental Health (Facebook) dataset...")
    
    file_path = '../data/mental_health.csv'
    
    try:
        df = pd.read_csv(file_path)
        print(f"   ✓ Loaded {len(df):,} posts")
        
        # Ensure columns are text and label
        if 'text' not in df.columns:
            text_col = [col for col in df.columns if col.lower() in ['text', 'post', 'message', 'content']][0]
            df = df.rename(columns={text_col: 'text'})
        
        if 'label' not in df.columns:
            label_col = [col for col in df.columns if col.lower() in ['label', 'class', 'target']][0]
            df = df.rename(columns={label_col: 'label'})
        
        df = df[['text', 'label']]
        
        # Map string labels to binary if needed
        if df['label'].dtype == 'object':
            label_map = {}
            unique_labels = df['label'].unique()
            for lbl in unique_labels:
                lbl_lower = str(lbl).lower()
                if 'anxiet' in lbl_lower or 'depress' in lbl_lower or 'stress' in lbl_lower:
                    label_map[lbl] = 1
                else:
                    label_map[lbl] = 0
            df['label'] = df['label'].map(label_map)
        
        # Ensure label is integer
        df['label'] = df['label'].astype(int)
        
        # Preprocess
        df['text'] = df['text'].apply(minimal_preprocess)
        df = df.dropna(subset=['text'])
        
        # Add source
        df['source'] = 'facebook'
        
        print(f"   ✓ After preprocessing: {len(df):,} samples")
        print(f"   Label distribution: {df['label'].value_counts().to_dict()}")
        
        return df
    
    except Exception as e:
        print(f"   ✗ Error loading Mental Health: {e}")
        return pd.DataFrame()


def combine_datasets():
    """Combine all three datasets"""
    print("\n" + "="*60)
    print("COMBINING DATASETS")
    print("="*60)
    
    # Load datasets
    sent140 = load_sentiment140(sample_size=100000)
    suicide = load_suicide_detection()
    mental = load_mental_health()
    
    # Combine
    combined = pd.concat([sent140, suicide, mental], ignore_index=True)
    
    print(f"\n✓ Combined dataset size: {len(combined):,} samples")
    
    # Shuffle
    combined = combined.sample(frac=1, random_state=42).reset_index(drop=True)
    
    print(f"\n📊 Final Label Distribution:")
    label_counts = combined['label'].value_counts()
    for label, count in label_counts.items():
        percentage = (count / len(combined)) * 100
        label_name = "Normal" if label == 0 else "Stressed/Depressed"
        print(f"   {label_name} (label={label}): {count:,} ({percentage:.1f}%)")
    
    print(f"\n📊 Source Distribution:")
    source_counts = combined['source'].value_counts()
    for source, count in source_counts.items():
        percentage = (count / len(combined)) * 100
        print(f"   {source}: {count:,} ({percentage:.1f}%)")
    
    return combined


def split_dataset(df):
    """Split into train/validation/test sets (80/10/10)"""
    print("\n" + "="*60)
    print("SPLITTING DATASET")
    print("="*60)
    
    X = df['text'].values
    y = df['label'].values
    
    # First split: 80% train, 20% temp (for validation + test)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    
    # Second split: 50% validation, 50% test (10% each of total)
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42
    )
    
    print(f"\n✓ Training samples:   {len(X_train):,} ({len(X_train)/len(df)*100:.1f}%)")
    print(f"✓ Validation samples: {len(X_val):,} ({len(X_val)/len(df)*100:.1f}%)")
    print(f"✓ Test samples:       {len(X_test):,} ({len(X_test)/len(df)*100:.1f}%)")
    
    # Create DataFrames
    train_df = pd.DataFrame({'text': X_train, 'label': y_train})
    val_df = pd.DataFrame({'text': X_val, 'label': y_val})
    test_df = pd.DataFrame({'text': X_test, 'label': y_test})
    
    # Print label distributions for each split
    print(f"\n📊 Training set label distribution:")
    for label, count in train_df['label'].value_counts().items():
        percentage = (count / len(train_df)) * 100
        label_name = "Normal" if label == 0 else "Stressed/Depressed"
        print(f"   {label_name}: {count:,} ({percentage:.1f}%)")
    
    return train_df, val_df, test_df


def save_datasets(combined, train_df, val_df, test_df):
    """Save processed datasets to CSV files"""
    print("\n" + "="*60)
    print("SAVING DATASETS")
    print("="*60)
    
    # Create processed directory if it doesn't exist
    os.makedirs('../data/processed', exist_ok=True)
    
    # Save files
    combined.to_csv('../data/processed/combined_dataset.csv', index=False)
    print("✓ Saved: data/processed/combined_dataset.csv")
    
    train_df.to_csv('../data/processed/train.csv', index=False)
    print("✓ Saved: data/processed/train.csv")
    
    val_df.to_csv('../data/processed/validation.csv', index=False)
    print("✓ Saved: data/processed/validation.csv")
    
    test_df.to_csv('../data/processed/test.csv', index=False)
    print("✓ Saved: data/processed/test.csv")
    
    print("\n✅ Data preparation complete!")


def main():
    """Main data preparation pipeline"""
    print("="*60)
    print("MINDTRACK AI - DATA PREPARATION (PHASE 2)")
    print("="*60)
    
    # Combine datasets
    combined = combine_datasets()
    
    if len(combined) == 0:
        print("\n❌ No data loaded. Please check dataset files and paths.")
        return
    
    # Split datasets
    train_df, val_df, test_df = split_dataset(combined)
    
    # Save datasets
    save_datasets(combined, train_df, val_df, test_df)
    
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    print(f"Total samples:      {len(combined):,}")
    print(f"Training samples:   {len(train_df):,}")
    print(f"Validation samples: {len(val_df):,}")
    print(f"Test samples:       {len(test_df):,}")
    print("\n✅ Ready for Phase 3: BERT Model Training")
    print("="*60)


if __name__ == "__main__":
    main()
