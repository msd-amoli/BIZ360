import re


class EntityExtractor:
    """
    Lightweight NLP entity + context resolver for ERP assistant.
    No LLM, but structured pattern + semantic rules.
    """

    def __init__(self):
        # follow-up reference words
        self.followup_words = {
            "it", "that", "this", "same", "those", "them", "again"
        }

        # weak stopwords for cleaning entity text
        self.ignore_words = {
            "show", "give", "tell", "me", "get", "list",
            "details", "about", "please", "fetch"
        }

    # -----------------------------
    # MAIN ENTRY
    # -----------------------------
    def extract(self, message: str, memory: dict = None):
        """
        Returns structured entity object
        """

        msg = message.lower().strip()

        return {
            "invoice_id": self._extract_invoice_id(msg),
            "product_hint": self._extract_product_hint(msg),
            "is_followup": self._is_followup(msg),
            "clean_text": self._clean_text(msg)
        }

    # -----------------------------
    # INVOICE ID EXTRACTION
    # -----------------------------
    def _extract_invoice_id(self, msg: str):
        numbers = re.findall(r"\d+", msg)
        if numbers:
            return numbers[0]
        return None

    # -----------------------------
    # FOLLOW-UP DETECTION
    # -----------------------------
    def _is_followup(self, msg: str):
        return any(word in msg.split() for word in self.followup_words)

    # -----------------------------
    # PRODUCT / CONTEXT HINT
    # -----------------------------
    def _extract_product_hint(self, msg: str):
        words = msg.split()

        filtered = [
            w for w in words
            if w not in self.ignore_words and not w.isdigit()
        ]

        if not filtered:
            return None

        return " ".join(filtered[:3])  # small semantic hint

    # -----------------------------
    # CLEAN TEXT FOR NLP USE
    # -----------------------------
    def _clean_text(self, msg: str):
        words = msg.split()

        cleaned = [
            w for w in words
            if w not in self.ignore_words
        ]

        return " ".join(cleaned)