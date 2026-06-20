def detect_intent(message: str):

    message = message.lower()

    if "low stock" in message:
        return "LOW_STOCK"

    elif "purchase order" in message or "create po" in message:
        return "CREATE_PO"

    elif "invoice" in message:
        return "CREATE_INVOICE"

    elif "highest sale" in message:
        return "HIGH_SALE"

    elif "lowest sale" in message:
        return "LOW_SALE"

    return "UNKNOWN"