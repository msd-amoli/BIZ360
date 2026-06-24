import re

class ResponseEngine:

    def detect_emotion(self, message: str):

        msg = message.lower()

        # very simple ML-style rule classifier (you can later replace with real model)
        if any(w in msg for w in ["angry", "hate", "worst", "useless", "idiot"]):
            return "angry"

        if any(w in msg for w in ["thank", "thanks", "good", "great", "awesome"]):
            return "positive"

        if any(w in msg for w in ["hi", "hello", "hey"]):
            return "greeting"

        if any(w in msg for w in ["confused", "don't understand", "help"]):
            return "confused"

        return "neutral"


    def format_reply(self, intent: str, raw_reply: str, emotion: str):

        # GREETING FLOW
        if intent == "GREETING" or emotion == "greeting":
            return "👋 Hello! I'm your Biz360 AI Assistant. How can I help you with ERP today?"

        # POSITIVE USER
        if emotion == "positive":
            return f"😊 {raw_reply} — Happy to help you!"

        # ANGRY USER
        if emotion == "angry":
            return "I understand you're frustrated. Let me help you fix this step by step."

        # CONFUSED USER
        if emotion == "confused":
            return "No problem — tell me what you're trying to do, I’ll guide you step by step."

        # DEFAULT ERP RESPONSE
        return raw_reply