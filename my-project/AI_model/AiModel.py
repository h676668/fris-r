import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

class AIModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.model = LogisticRegression()
        self.is_trained = False

    def train(self, data_splits):
        """Trener modellen på treningssettet fra Data.py"""
        X_train = data_splits['train']['text']
        y_train = data_splits['train']['label']
        
        # Gjør tekst om til tall (vektorisering)
        X_vectorized = self.vectorizer.fit_transform(X_train)
        
        # Trener den logiske regresjonsmodellen
        self.model.fit(X_vectorized, y_train)
        self.is_trained = True
        print("\033[92m[AI] Trening fullført på datasettet!\033[0m")

    def predict_safe(self, text):
        """Forutsier kategori og gir en sikkerhetsscore (confidence)"""
        if not self.is_trained:
            return "usikker", 0.0
            
        X_vec = self.vectorizer.transform([text])
        probabilities = self.model.predict_proba(X_vec)[0]
        max_idx = np.argmax(probabilities)
        
        intent = self.model.classes_[max_idx]
        confidence = probabilities[max_idx]
        
        return intent, confidence