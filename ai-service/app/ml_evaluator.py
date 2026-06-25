from sklearn.metrics import classification_report, confusion_matrix
from app.intent_model import IntentModel

def evaluate_model():

    model = IntentModel()

    test_data = [
        ("hi", "GREETING"),
        ("hello", "GREETING"),
        ("show users", "USER_COUNT"),
        ("how many users", "USER_COUNT"),
        ("low stock items", "LOW_STOCK"),
        ("inventory low", "LOW_STOCK"),
        ("sales report", "SALES_REPORT"),
        ("total sales", "SALES_REPORT"),
        ("invoice 10", "INVOICE_DETAIL"),
        ("create purchase order", "CREATE_PO"),
    ]

    X_test = [x[0] for x in test_data]
    y_true = [x[1] for x in test_data]

    y_pred = [model.predict(x)[0] for x in X_test]

    print("\nCLASSIFICATION REPORT:\n")
    print(classification_report(y_true, y_pred))

    print("\nCONFUSION MATRIX:\n")
    print(confusion_matrix(y_true, y_pred))