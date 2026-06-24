import re
from collections import defaultdict


class MemoryEngine:

    def __init__(self):
        self.session_memory = defaultdict(lambda: {
            "last_intent": None,
            "last_entity": None,
            "last_data": None
        })


    def update(self, session_id: str, intent: str, data=None, message: str = ""):

        memory = self.session_memory[session_id]

        # store intent
        memory["last_intent"] = intent

        # extract ERP entities (numbers, codes, names)
        entity = self.extract_entity(message, data)

        if entity:
            memory["last_entity"] = entity

        if data:
            memory["last_data"] = data


    def extract_entity(self, message: str, data):

        # invoice id
        numbers = re.findall(r"\d+", message)
        if numbers:
            return {
                "type": "id",
                "value": numbers[0]
            }

        # product / text-based entity fallback
        words = message.lower().split()

        ignore = {"show", "give", "tell", "me", "that", "this", "list", "get"}

        filtered = [w for w in words if w not in ignore]

        if len(filtered) > 0:
            return {
                "type": "text",
                "value": " ".join(filtered[:3])
            }

        return None


    def resolve(self, session_id: str, message: str):

        memory = self.session_memory[session_id]

        msg = message.lower()

        # HANDLE FOLLOW-UP WORDS
        if any(w in msg for w in ["that", "it", "same", "this", "those"]):
            return memory["last_entity"]

        # direct number reference
        numbers = re.findall(r"\d+", message)
        if numbers:
            return {
                "type": "id",
                "value": numbers[0]
            }

        return None