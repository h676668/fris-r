import joblib
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

class AIModel:
    def __init__(self, model_file='frisor_ai_modell.pkl'):
        self.model_file = model_file
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 5), lowercase=True)),
            ('clf', LogisticRegression(C=10, max_iter=1000))
        ])

    def train(self, split_data):
        X_train, y_train = split_data['train']['text'], split_data['train']['label']
        X_val, y_val = split_data['val']['text'], split_data['val']['label']
        X_test, y_test = split_data['test']['text'], split_data['test']['label']

        print(f"Trener på {len(X_train)} eksempler...")
        self.pipeline.fit(X_train, y_train)

        print(f"Validerings-nøyaktighet: {self.pipeline.score(X_val, y_val) * 100:.1f}%")
        print(f"Test-nøyaktighet: {self.pipeline.score(X_test, y_test) * 100:.1f}%")
        
        y_pred = self.pipeline.predict(X_test)
        print("\nKlassifiseringsrapport (Test-sett):")
        print(classification_report(y_test, y_pred))

        joblib.dump(self.pipeline, self.model_file)
        print("Modell lagret!")

    def predict_safe(self, text, threshold=0.40):
        if not os.path.exists(self.model_file):
            return "error_no_model", 0.0
        
        model = joblib.load(self.model_file)
        probs = model.predict_proba([text])[0]
        max_idx = np.argmax(probs)
        max_prob = probs[max_idx]
        label = model.classes_[max_idx]

        return (label, max_prob) if max_prob >= threshold else ("usikker", max_prob)