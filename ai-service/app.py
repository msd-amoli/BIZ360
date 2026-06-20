from fastapi import FastAPI
from pydantic import BaseModel


from services.prediction_service import predict_intent

app = FastAPI(title="BIZ360 AI Service")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):

    intent = predict_intent(request.message)

    return {
        "success": True,
        "message": request.message,
        "intent": intent
    }

@app.get("/")
def home():
    return {
        "status": "BIZ AI Service Running"
    }