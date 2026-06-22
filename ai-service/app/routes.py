from fastapi import APIRouter
from app.schemas import ChatRequest
from app.services import generate_reply
from app.context_manager import context_manager

router = APIRouter()


@router.post("/chat")
def chat(request: ChatRequest):

    context_manager.add_message(
        request.session_id,
        "user",
        request.message
    )

    context = context_manager.get_messages(request.session_id)

    response = generate_reply(
        request.message,
        context,
        request.token
    )

    context_manager.add_message(
        request.session_id,
        "assistant",
        response["reply"]
    )

    return {
        "session_id": request.session_id,
        "response": response
    }