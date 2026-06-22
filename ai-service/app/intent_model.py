from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

class IntentModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.model = LogisticRegression()

        self.train()

    def train(self):
        training_data = [
            "show low stock items",
            "low stock",
            "inventory status",
            "how many users",
            "user count",
            "total users",
            "create purchase order",
            "make po",
            "generate purchase order",
            "sales report",
            "today sales"
        ]

        labels = [
            "LOW_STOCK",
            "LOW_STOCK",
            "LOW_STOCK",
            "USER_COUNT",
            "USER_COUNT",
            "USER_COUNT",
            "CREATE_PO",
            "CREATE_PO",
            "CREATE_PO",
            "SALES_REPORT",
            "SALES_REPORT"
        ]

        X = self.vectorizer.fit_transform(training_data)
        self.model.fit(X, labels)

    def predict(self, text: str):
        X = self.vectorizer.transform([text])
        return self.model.predict(X)[0]