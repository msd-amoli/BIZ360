import joblib

# Load model once when server starts
model = joblib.load("model/intent_model.pkl")


def predict_intent(message: str):
    prediction = model.predict([message])
    return prediction[0]