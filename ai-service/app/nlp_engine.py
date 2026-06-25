import random


class NLPEngine:

    def generate(self, intent: str, data, entities: dict, memory=None):

        if intent == "LOW_STOCK":
            return self._wrap(self.low_stock(data))

        if intent == "USER_COUNT":
            return self._wrap(self.users(data))
        if intent == "USER_LIST":
            return self._wrap(self.user_list(data))

        if intent == "SALES_REPORT":
            return self._wrap(self.sales(data))

        if intent == "INVOICE_DETAIL":
            return self._wrap(self.invoice(data))

        if intent == "CREATE_PO":
            return self._wrap(self.po())

        if intent == "GREETING":
            return self._wrap("👋 Hello! I’m your Biz  AI Assistant. Ask me anything about ERP.")

        return self._wrap(self.fallback())

    # ---------------- WRAPPER ----------------
    def _wrap(self, text):

    # do NOT wrap list responses (IMPORTANT)
     if ":\n" in text or "\n" in text:
        return text

     return f"{random.choice([
        'Got it.',
        'Here you go.',
        'Alright.'
    ])} {text}"
    def user_list(self, data):

     if not data or not isinstance(data, dict):
        return "No user data found."

     users = data.get("content", [])

     if not users:
        return "No users found."

     names = [u.get("name") for u in users if u.get("name")]

     return "👥 User Names:\n" + "\n".join(names)

    # ---------------- LOW STOCK ----------------
    def low_stock(self, items):

        if not items:
            return "👍 Everything looks fine. No low stock alerts right now."

        top = sorted(items, key=lambda x: x.get("baseQuantity", 0))[0]

        return (
            f"📦 {len(items)} items are below minimum stock.\n"
            f"🔴 Critical: {top.get('productName')} "
            f"(Stock: {top.get('baseQuantity')}, Min: {top.get('minStockLevel')}).\n"
            f"Recommend restocking soon."
        )

    # ---------------- USERS ----------------
    def users(self, data):

        count = data.get("totalElements", 0)
        users = data.get("content", [])

        return (
            f"👥 Total users: {count}.\n"
            f"Tip: You can ask 'show user names' or 'admin list'."
        )

    # ---------------- SALES ----------------
    def sales(self, data):

        total = data.get("totalSales", 0)

        return (
            f"💰 Total sales: {total}.\n"
            f"Want breakdown or monthly analysis?"
        )

    # ---------------- INVOICE ----------------
    def invoice(self, data):

        if not isinstance(data, dict):
            return "❌ Invoice not found."

        return (
            f"🧾 Invoice Details:\n"
            f"Customer: {data.get('customerName')}\n"
            f"Status: {data.get('status')}\n"
            f"Net Total: {data.get('netTotal')}"
        )

    # ---------------- PO ----------------
    def po(self):

        return random.choice([
            "🛒 Purchase Order started. Select an item.",
            "🛒 Let's create a PO — choose product.",
            "🛒 PO flow initiated. What item?"
        ])

    # ---------------- FALLBACK ----------------
    def fallback(self):

        return random.choice([
            "I didn’t get that clearly. Try inventory, users, invoices or sales.",
            "Hmm 🤔 I can help with ERP data like stock, users, invoices.",
            "Please rephrase your request."
        ])