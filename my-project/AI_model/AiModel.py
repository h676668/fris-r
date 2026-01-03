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
        # TfidfVectorizer med char_wb er supert for skrivefeil!
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 5), lowercase=True)),
            ('clf', LogisticRegression(C=10, max_iter=1000, class_weight='balanced'))
        ])
        self.loaded_model = None

    def train(self, split_data):
        X_train, y_train = split_data['train']['text'], split_data['train']['label']
        X_val, y_val = split_data['val']['text'], split_data['val']['label']
        X_test, y_test = split_data['test']['text'], split_data['test']['label']

        print(f"\033[94m[INFO]\033[0m Trener på {len(X_train)} eksempler...")
        self.pipeline.fit(X_train, y_train)

        # Beregn score for å sjekke overfitting/underfitting
        train_acc = self.pipeline.score(X_train, y_train) * 100
        val_acc = self.pipeline.score(X_val, y_val) * 100
        test_acc = self.pipeline.score(X_test, y_test) * 100

        print("\n" + "="*40)
        print(f"📊 \033[1mTRENINGSRAPPORT\033[0m")
        print(f"Trening-ACC:    {train_acc:.1f}%")
        print(f"Validering-ACC: {val_acc:.1f}%")
        print(f"Test-ACC:       {test_acc:.1f}%")
        print("="*40)

        # Analyse av resultatet
        if train_acc > 98 and val_acc < 85:
            print("⚠️ \033[91mADVARSEL:\033[0m Modellen OVERFITTER. Den har memorert treningstallene.")
        elif train_acc < 70:
            print("⚠️ \033[93mADVARSEL:\033[0m Modellen UNDERFITTER. Den trenger mer data eller bedre vekting.")
        else:
            print("✅ \033[92mModellen ser balansert ut!\033[0m")

        y_pred = self.pipeline.predict(X_test)
        print("\nKlassifiseringsrapport (Detaljert):")
        print(classification_report(y_test, y_pred))

        joblib.dump(self.pipeline, self.model_file)
        self.loaded_model = self.pipeline # Lagre i minnet med en gang
        print("Modell lagret til disk og klar i minnet!")

    def predict_safe(self, text, threshold=0.40):
        # Last modell fra disk kun hvis den ikke allerede ligger i minnet
        if self.loaded_model is None:
            if os.path.exists(self.model_file):
                self.loaded_model = joblib.load(self.model_file)
            else:
                return "error_no_model", 0.0
        
        probs = self.loaded_model.predict_proba([text])[0]
        max_idx = np.argmax(probs)
        max_prob = probs[max_idx]
        label = self.loaded_model.classes_[max_idx]

        if max_prob < threshold:
            return "usikker", max_prob
        
        return label, max_prob