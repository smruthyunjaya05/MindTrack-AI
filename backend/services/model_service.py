"""
DistilBERT Model Service for MindTrack AI
Provides real-time mental health sentiment analysis using trained BERT model
"""

import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import os
from pathlib import Path

class ModelService:
    """Service for loading and running DistilBERT emotion classification model"""
    
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.tokenizer = None
        self.model_loaded = False
        self.max_length = 128
        
        # Label mapping
        self.id2label = {0: "Normal", 1: "Stressed"}
        self.label2id = {"Normal": 0, "Stressed": 1}
        
    def load_model(self):
        """Load the trained DistilBERT model and tokenizer"""
        try:
            # Get model path (relative to backend directory)
            backend_dir = Path(__file__).parent.parent
            model_path = backend_dir.parent / "data" / "models" / "distilbert_emotion_model"
            
            if not model_path.exists():
                print(f"⚠️  Model not found at {model_path}")
                print("   Using keyword-based fallback analysis")
                return False
            
            print(f"🔄 Loading DistilBERT model from {model_path}...")
            
            # Load tokenizer
            self.tokenizer = DistilBertTokenizer.from_pretrained(str(model_path))
            
            # Load model
            self.model = DistilBertForSequenceClassification.from_pretrained(
                str(model_path),
                num_labels=2,
                id2label=self.id2label,
                label2id=self.label2id
            )
            
            # Move to device and set to evaluation mode
            self.model.to(self.device)
            self.model.eval()
            
            self.model_loaded = True
            print(f"✅ Model loaded successfully on {self.device}")
            print(f"   Accuracy: 94.42% | F1-Score: 96.62%")
            
            return True
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print("   Falling back to keyword-based analysis")
            self.model_loaded = False
            return False
    
    def predict(self, text):
        """
        Predict sentiment for given text
        
        Args:
            text (str): Input text to analyze
            
        Returns:
            dict: Prediction results with sentiment, confidence, and probabilities
        """
        if not self.model_loaded:
            return None
        
        try:
            # Tokenize input
            encoding = self.tokenizer(
                text,
                add_special_tokens=True,
                max_length=self.max_length,
                padding='max_length',
                truncation=True,
                return_attention_mask=True,
                return_tensors='pt'
            )
            
            # Move to device
            input_ids = encoding['input_ids'].to(self.device)
            attention_mask = encoding['attention_mask'].to(self.device)
            
            # Make prediction
            with torch.no_grad():
                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask
                )
                
                # Get probabilities
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)
                
                # Get prediction
                predicted_class = torch.argmax(probabilities, dim=1).item()
                confidence = probabilities[0][predicted_class].item()
                
                sentiment = self.id2label[predicted_class]
                
                return {
                    'sentiment': sentiment,
                    'confidence': float(confidence),
                    'probabilities': {
                        'Normal': float(probabilities[0][0]),
                        'Stressed': float(probabilities[0][1])
                    },
                    'prediction_source': 'distilbert_model'
                }
                
        except Exception as e:
            print(f"❌ Error during prediction: {e}")
            return None
    
    def predict_batch(self, texts):
        """
        Predict sentiment for multiple texts
        
        Args:
            texts (list): List of input texts
            
        Returns:
            list: List of prediction dictionaries
        """
        if not self.model_loaded:
            return [None] * len(texts)
        
        try:
            # Tokenize all texts
            encodings = self.tokenizer(
                texts,
                add_special_tokens=True,
                max_length=self.max_length,
                padding='max_length',
                truncation=True,
                return_attention_mask=True,
                return_tensors='pt'
            )
            
            # Move to device
            input_ids = encodings['input_ids'].to(self.device)
            attention_mask = encodings['attention_mask'].to(self.device)
            
            # Make predictions
            with torch.no_grad():
                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask
                )
                
                # Get probabilities
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)
                
                # Process results
                results = []
                for i in range(len(texts)):
                    predicted_class = torch.argmax(probabilities[i]).item()
                    confidence = probabilities[i][predicted_class].item()
                    sentiment = self.id2label[predicted_class]
                    
                    results.append({
                        'sentiment': sentiment,
                        'confidence': float(confidence),
                        'probabilities': {
                            'Normal': float(probabilities[i][0]),
                            'Stressed': float(probabilities[i][1])
                        },
                        'prediction_source': 'distilbert_model'
                    })
                
                return results
                
        except Exception as e:
            print(f"❌ Error during batch prediction: {e}")
            return [None] * len(texts)


# Global model service instance
model_service = ModelService()
