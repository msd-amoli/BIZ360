from app.intent_model import IntentModel
from app.erp_client import (
    get_low_stock,
    get_users,
    get_invoices,
    get_invoice_by_id
)
from app.context_manager import context_manager
from app.memory_engine import MemoryEngine
from app.ai_response_formatter import AIResponseFormatter

import re

# INIT
intent_model = IntentModel()
memory_engine = MemoryEngine()
formatter = AIResponseFormatter()

def is_safe_intent(intent: str, message: str):
    msg = message.lower().strip()

  
    if intent == "CREATE_PO":
        if msg in ["hi", "hello", "hey", "bye"]:
            return False
    return True

def extract_context(message: str, context: list):

    last_user_msgs = [
        c["message"] if isinstance(c["message"], str)
        else c["message"].get("message", "")
        for c in context if c["role"] == "user"
    ]

    last_ref = last_user_msgs[-2:] if len(last_user_msgs) >= 2 else last_user_msgs

    number = re.findall(r"\d+", message)

    return {
        "history": last_ref,
        "number": number[0] if number else None
    }



def build_response(intent, data, message, session_id, context_data):

    memory_engine.update(session_id, intent, data, message)

    raw_reply = formatter.format(intent, data, message)

    return {
        "intent": intent,
        "reply": raw_reply,
        "data": data,
        "context_hint": context_data
    }



def generate_reply(message: str, context: list, token: str):

    session_id = (
        context[0].get("session_id", "default")
        if context and isinstance(context[0], dict)
        else "default"
    )

    intent = intent_model.predict(message)
    if not is_safe_intent(intent, message):
     return {
        "intent": "FALLBACK",
        "reply": "I’m here to help you with ERP tasks like inventory, users, invoices, and purchase orders. Please ask something related to the system.",
        "data": None,
        "context_hint": extract_context(message, context)
    }

    context_data = extract_context(message, context)

    resolved_entity = memory_engine.resolve(session_id, message)

    flow_state = context_manager.get_flow_state(session_id)

    if flow_state and flow_state.get("type") == "CREATE_PO":

        if flow_state.get("step") == "SELECT_ITEM":

            flow_state["selected_item"] = message
            flow_state["step"] = "CONFIRM"

            context_manager.set_flow_state(session_id, flow_state)

            return build_response(intent, flow_state, message, session_id, context_data)

        if flow_state.get("step") == "CONFIRM":

            if message.lower() == "yes":
                context_manager.clear_flow_state(session_id)
                return build_response(intent, flow_state, message, session_id, context_data)

            context_manager.clear_flow_state(session_id)
            return build_response(intent, flow_state, message, session_id, context_data)

    if intent == "LOW_STOCK":
        data = get_low_stock(token)
        return build_response(intent, data, message, session_id, context_data)


    elif intent == "USER_COUNT":
        data = get_users(token)
        return build_response(intent, data, message, session_id, context_data)

   
    elif intent == "SALES_REPORT":
        invoices = get_invoices(token)

        total_sales = sum(
            inv.get("netTotal", 0)
            for inv in invoices
            if inv.get("status") != "CANCELLED"
        )

        data = {"totalSales": total_sales}

        return build_response(intent, data, message, session_id, context_data)

    elif intent == "INVOICE_DETAIL":

        invoice_id = context_data["number"]

        if not invoice_id and resolved_entity:
            invoice_id = resolved_entity.get("value")

        if not invoice_id:
            return {
                "intent": intent,
                "reply": "Please provide invoice ID",
                "data": None,
                "context_hint": context_data
            }

        data = get_invoice_by_id(token, int(invoice_id))

        return build_response(intent, data, message, session_id, context_data)

   
    elif intent == "CREATE_PO":

        flow = {
            "type": "CREATE_PO",
            "step": "SELECT_ITEM",
            "session_id": session_id
        }

        context_manager.set_flow_state(session_id, flow)

        return build_response(intent, None, message, session_id, context_data)

 
    return {
    "intent": "FALLBACK",
    "reply": "I couldn't map your request properly. Try asking about inventory, users, invoices, or purchase orders.",
    "data": None,
    "context_hint": context_data
}