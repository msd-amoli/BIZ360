from app.intent_model import IntentModel
from app.erp_client import (
    get_low_stock,
    get_users,
    get_invoices,
    get_invoice_by_id
)
from app.context_manager import context_manager
import re

intent_model = IntentModel()


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


def generate_reply(message: str, context: list, token: str):

    intent = intent_model.predict(message)
    context_data = extract_context(message, context)

    # SAFE SESSION ID (FIXED)
    session_id = context[0].get("session_id", "default") if context else "default"

    flow_state = context_manager.get_flow_state(session_id)

    # -----------------------------
    # PO FLOW
    # -----------------------------
    if flow_state and flow_state.get("type") == "CREATE_PO":

        if flow_state.get("step") == "SELECT_ITEM":

            flow_state["selected_item"] = message
            flow_state["step"] = "CONFIRM"

            context_manager.set_flow_state(session_id, flow_state)

            return {
                "intent": "CREATE_PO_FLOW",
                "reply": f"You selected '{message}'. Confirm PO creation? (yes/no)",
                "data": flow_state,
                "context_hint": context_data
            }

        if flow_state.get("step") == "CONFIRM":

            if message.lower() == "yes":

                context_manager.clear_flow_state(session_id)

                return {
                    "intent": "CREATE_PO_FLOW",
                    "reply": "PO created successfully (mock step for now)",
                    "data": flow_state,
                    "context_hint": context_data
                }

            context_manager.clear_flow_state(session_id)

            return {
                "intent": "CREATE_PO_FLOW",
                "reply": "PO cancelled",
                "data": flow_state,
                "context_hint": context_data
            }

    # LOW STOCK
    if intent == "LOW_STOCK":
        data = get_low_stock(token)
        return {
            "intent": intent,
            "reply": "Here are low stock items",
            "data": data,
            "context_hint": context_data
        }

    # USERS
    elif intent == "USER_COUNT":
        users = get_users(token)

        count = users.get("totalElements", len(users.get("content", [])))

        return {
            "intent": intent,
            "reply": f"Total users: {count}",
            "data": users,
            "context_hint": context_data
        }

    # SALES
    elif intent == "SALES_REPORT":
        invoices = get_invoices(token)

        total_sales = sum(
            inv.get("netTotal", 0)
            for inv in invoices
            if inv.get("status") != "CANCELLED"
        )

        return {
            "intent": intent,
            "reply": f"Total sales (excluding cancelled): {total_sales}",
            "data": {"totalSales": total_sales},
            "context_hint": context_data
        }

    # INVOICE DETAIL
    elif intent == "INVOICE_DETAIL":

        invoice_id = context_data["number"]

        if not invoice_id:
            return {
                "intent": intent,
                "reply": "Please provide invoice ID",
                "data": None,
                "context_hint": context_data
            }

        data = get_invoice_by_id(token, int(invoice_id))

        return {
            "intent": intent,
            "reply": f"Here is invoice {invoice_id}",
            "data": data,
            "context_hint": context_data
        }

    # CREATE PO
    elif intent == "CREATE_PO":

        context_manager.set_flow_state(session_id, {
            "type": "CREATE_PO",
            "step": "SELECT_ITEM",
            "session_id": session_id
        })

        return {
            "intent": intent,
            "reply": "Select item from low stock list to create PO",
            "data": None,
            "context_hint": context_data
        }

    return {
        "intent": intent,
        "reply": "I didn't understand the request",
        "data": None,
        "context_hint": context_data
    }