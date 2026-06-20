import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Load dataset
df = pd.read_csv("data/intents.csv")

# Inputs and labels
X = df["text"]
y = df["intent"]

# Build pipeline
model = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("classifier", MultinomialNB())
])

# Train model
model.fit(X, y)

# Save model
joblib.dump(model, "model/intent_model.pkl")

print("Intent model trained successfully.")