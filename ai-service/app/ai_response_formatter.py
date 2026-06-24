class AIResponseFormatter:

    def format(self, intent: str, data, message: str):

        
        if intent == "LOW_STOCK":

            items = data if isinstance(data, list) else []

            if not items:
                return "All items are sufficiently stocked."

            top = items[0]

            return (
                f"📦 I found {len(items)} low stock items.\n\n"
                f"🔴 Most critical item: {top.get('productName')} "
                f"(Stock: {top.get('baseQuantity')})\n\n"
                f"👉 Recommendation: You should create a Purchase Order for restocking soon."
            )

       
        if intent == "USER_COUNT":

            count = data.get("totalElements", len(data.get("content", [])))

            return (
                f"👥 Total active users in your ERP system: {count}.\n\n"
                f"👉 Suggestion: You can review inactive users for cleanup or audit."
            )

        
        if intent == "SALES_REPORT":

            total = data.get("totalSales", 0)

            return (
                f"💰 Total sales (excluding cancelled invoices): {total}.\n\n"
                f"📊 Insight: You can compare this with previous month for trend analysis."
            )

       
        if intent == "INVOICE_DETAIL":

            if isinstance(data, dict):
                return (
                    f"🧾 Invoice details retrieved successfully.\n\n"
                    f"Customer: {data.get('customerName')}\n"
                    f"Status: {data.get('status')}\n"
                    f"Net Total: {data.get('netTotal')}\n\n"
                    f"👉 You can download or print this invoice from ERP module."
                )

            return "Invoice data not found."

        if intent == "CREATE_PO":

            return (
                "🛒 Purchase Order flow started.\n\n"
                "👉 Please select an item from low stock list to continue."
            )


        return "I understood your request but need more details to assist properly."