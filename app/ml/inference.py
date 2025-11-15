"""ML inference module for emotion detection using trained BERT model."""
import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import re
from typing import Dict, Tuple


class EmotionPredictor:
    """Emotion prediction using fine-tuned DistilBERT model."""
    
    def __init__(self, model_path: str):
        """
        Initialize the emotion predictor.
        
        Args:
            model_path: Path to the trained model directory
        """
        self.model_path = model_path
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = None
        self.tokenizer = None
        self.max_length = 128
        
        # Label mapping
        self.label_map = {
            0: 'Normal',
            1: 'Stressed/Depressed'
        }
        
        self.load_model()
    
    def load_model(self):
        """Load the trained model and tokenizer."""
        try:
            print(f"Loading model from {self.model_path}...")
            
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(
                    f"Model not found at {self.model_path}. "
                    "Please train the model first using train_bert_simple.py"
                )
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path)
            self.model.to(self.device)
            self.model.eval()
            
            print(f"✓ Model loaded successfully on {self.device}")
            
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            raise
    
    def preprocess_text(self, text: str) -> str:
        """
        Minimal preprocessing for BERT input.
        
        Args:
            text: Raw input text
            
        Returns:
            Preprocessed text
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    def predict(self, text: str) -> Dict[str, any]:
        """
        Predict emotion for given text.
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dictionary containing:
                - sentiment: str ('Normal' or 'Stressed/Depressed')
                - confidence: float (0-1)
                - probabilities: dict with probabilities for each class
        """
        if self.model is None or self.tokenizer is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        # Preprocess
        text = self.preprocess_text(text)
        
        # Tokenize
        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        # Move to device
        input_ids = encoding['input_ids'].to(self.device)
        attention_mask = encoding['attention_mask'].to(self.device)
        
        # Inference
        with torch.no_grad():
            outputs = self.model(
                input_ids=input_ids,
                attention_mask=attention_mask
            )
            logits = outputs.logits
            
            # Apply softmax to get probabilities
            probabilities = torch.softmax(logits, dim=1)
            probs = probabilities.cpu().numpy()[0]
            
            # Get prediction
            pred_label = torch.argmax(probabilities, dim=1).item()
            confidence = probs[pred_label]
        
        # Format result
        result = {
            'sentiment': self.label_map[pred_label],
            'confidence': float(confidence),
            'probabilities': {
                'Normal': float(probs[0]),
                'Stressed/Depressed': float(probs[1])
            },
            'model_version': 'distilbert-v1'
        }
        
        return result
    
    def predict_batch(self, texts: list) -> list:
        """
        Predict emotions for a batch of texts.
        
        Args:
            texts: List of input texts
            
        Returns:
            List of prediction dictionaries
        """
        results = []
        for text in texts:
            try:
                result = self.predict(text)
                results.append(result)
            except Exception as e:
                results.append({
                    'error': str(e),
                    'sentiment': None,
                    'confidence': 0.0
                })
        
        return results


# Global predictor instance (lazy loading)
_predictor = None


def get_predictor(model_path: str = None) -> EmotionPredictor:
    """
    Get or create the global predictor instance.
    
    Args:
        model_path: Path to model directory (optional)
        
    Returns:
        EmotionPredictor instance
    """
    global _predictor
    
    if _predictor is None:
        if model_path is None:
            # Default path
            model_path = os.path.join(
                os.path.dirname(__file__),
                '../../data/models/distilbert_emotion_model'
            )
        
        _predictor = EmotionPredictor(model_path)
    
    return _predictor


def predict_emotion(text: str, model_path: str = None) -> Dict[str, any]:
    """
    Convenience function to predict emotion for a single text.
    
    Args:
        text: Input text to analyze
        model_path: Optional path to model directory
        
    Returns:
        Prediction dictionary with sentiment, confidence, and probabilities
    """
    predictor = get_predictor(model_path)
    return predictor.predict(text)
