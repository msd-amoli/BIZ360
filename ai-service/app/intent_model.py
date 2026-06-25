import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

class IntentModel:

    def __init__(self):

        self.model = None
        self.vectorizer = None

        self.load_or_train()


    def load_or_train(self):
        """
        If model exists → load it
        else → train simple base model
        """

        if os.path.exists("app/ml_model.pkl"):

            with open("app/ml_model.pkl", "rb") as f:
                data = pickle.load(f)

            self.model = data["model"]
            self.vectorizer = data["vectorizer"]

        else:
            self.train_model()


    def train_model(self):

        # REAL TRAINING DATASET (expand later anytime)
        training_data = [
            ("hello", "GREETING"),
    ("hi", "GREETING"),
    ("hey", "GREETING"),
    ("good morning", "GREETING"),
    ("good evening", "GREETING"),

    # ---------------- USERS ----------------
    ("show users", "USER_COUNT"),
    ("list users", "USER_COUNT"),
    ("how many users", "USER_COUNT"),
    ("user list", "USER_COUNT"),
    ("total users in system", "USER_COUNT"),

    # ---------------- LOW STOCK ----------------
    ("low stock", "LOW_STOCK"),
    ("show low stock items", "LOW_STOCK"),
    ("inventory low", "LOW_STOCK"),
    ("which items need restock", "LOW_STOCK"),
    ("stock below minimum level", "LOW_STOCK"),

    # ---------------- SALES ----------------
    ("sales report", "SALES_REPORT"),
    ("total sales", "SALES_REPORT"),
    ("revenue report", "SALES_REPORT"),
    ("monthly sales", "SALES_REPORT"),
    ("show earnings", "SALES_REPORT"),

    # ---------------- INVOICE ----------------
    ("invoice details", "INVOICE_DETAIL"),
    ("show invoice", "INVOICE_DETAIL"),
    ("get invoice", "INVOICE_DETAIL"),
    ("invoice info", "INVOICE_DETAIL"),
    ("find invoice", "INVOICE_DETAIL"),
    ("show user names", "USER_LIST"),
("user names", "USER_LIST"),
("admin list", "USER_LIST"),
("list users names", "USER_LIST"),
("give names", "USER_LIST"),

    # ---------------- PURCHASE ORDER ----------------
    ("create po", "CREATE_PO"),
    ("make purchase order", "CREATE_PO"),
    ("generate purchase order", "CREATE_PO"),
    ("new po", "CREATE_PO"),
    ("start purchase order", "CREATE_PO"),
        ]

        texts = [t[0] for t in training_data]
        labels = [t[1] for t in training_data]

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            analyzer="word",
            lowercase=True
        )

        X = self.vectorizer.fit_transform(texts)

        self.model = LogisticRegression(max_iter=200)
        self.model.fit(X, labels)

        # SAVE MODEL
        os.makedirs("app", exist_ok=True)

        with open("app/ml_model.pkl", "wb") as f:
            pickle.dump({
                "model": self.model,
                "vectorizer": self.vectorizer
            }, f)

    def predict(self, message: str):

     if not self.model:
        return "UNKNOWN", 0.0

     X = self.vectorizer.transform([message.lower()])

     proba = self.model.predict_proba(X)[0]
     label = self.model.classes_[proba.argmax()]
     confidence = float(proba.max())

     # fallback logic (IMPORTANT)
     if confidence < 0.35:
        return "UNKNOWN", confidence

     return label, confidence