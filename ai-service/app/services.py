from app.intent_model import IntentModel
from app.erp_client import (
    get_low_stock,
    get_users,
    get_invoices,
    get_invoice_by_id
)

from app.context_manager import context_manager
from app.memory_engine import MemoryEngine
from app.nlp_engine import NLPEngine


intent_model = IntentModel()
memory_engine = MemoryEngine()
nlp_engine = NLPEngine()


def smart_router(msg):

    msg = msg.lower()

    if any(w in msg for w in ["hi", "hello", "hey"]):
        return "GREETING"

    if any(w in msg for w in ["show user names", "user names", "admin list", "list names", "give names"]):
     return "USER_LIST"

    if any(w in msg for w in ["user", "users", "total users"]): 
     return "USER_COUNT"

    if any(w in msg for w in ["stock", "inventory", "product"]):
        return "LOW_STOCK"

    if "sales" in msg or "revenue" in msg:
        return "SALES_REPORT"

    if "invoice" in msg:
        return "INVOICE_DETAIL"

    if "po" in msg:
        return "CREATE_PO"

    return None


def generate_reply(message: str, context: list, token: str):

    session_id = (
        context[0].get("session_id", "default")
        if context and isinstance(context[0], dict)
        else "default"
    )

    intent, confidence = intent_model.predict(message)

    if intent == "UNKNOWN":
        intent = smart_router(message)

    memory_engine.update(session_id, intent, None, message)

    resolved = memory_engine.resolve(session_id, message)

    flow = context_manager.get_flow_state(session_id)

    # ---------------- PO FLOW ----------------
    if flow and flow.get("type") == "CREATE_PO":

        if flow.get("step") == "SELECT_ITEM":

            flow["step"] = "CONFIRM"
            flow["selected_item"] = message

            context_manager.set_flow_state(session_id, flow)

            return {
                "intent": intent,
                "reply": "🛒 Item selected. Confirm Purchase Order?",
                "session_id": session_id
            }

        if flow.get("step") == "CONFIRM":

            if message.lower() == "yes":
                context_manager.clear_flow_state(session_id)
                return {
                    "intent": intent,
                    "reply": "✅ Purchase Order created successfully.",
                    "session_id": session_id
                }

            context_manager.clear_flow_state(session_id)
            return {
                "intent": intent,
                "reply": "❌ Purchase Order cancelled.",
                "session_id": session_id
            }

    # ---------------- INTENT HANDLING ----------------
    data = None

    if intent == "LOW_STOCK":
        data = get_low_stock(token)

    elif intent == "USER_COUNT":
        data = get_users(token)
    
    elif intent == "SALES_REPORT":
        invoices = get_invoices(token)
        total = sum(i.get("netTotal", 0) for i in invoices if i.get("status") != "CANCELLED")
        data = {"totalSales": total}

    elif intent == "INVOICE_DETAIL":

        invoice_id = resolved["value"] if resolved else None

        if not invoice_id:
            return {
                "intent": intent,
                "reply": "Please provide invoice ID.",
                "session_id": session_id
            }

        data = get_invoice_by_id(token, int(invoice_id))

        if isinstance(data, list):
            data = data[0] if data else {}

    elif intent == "CREATE_PO":

        context_manager.set_flow_state(session_id, {
            "type": "CREATE_PO",
            "step": "SELECT_ITEM"
        })

        return {
            "intent": intent,
            "reply": "🛒 Purchase Order started. Select an item.",
            "session_id": session_id
        }

    # ---------------- FINAL RESPONSE ----------------
    reply = nlp_engine.generate(intent, data, {}, memory_engine.session_memory[session_id])

    if isinstance(reply, dict):
      reply = reply.get("reply", "")

    return {
        "intent": intent,
        "reply": reply,
        "session_id": session_id
    }