from collections import defaultdict


class ContextManager:
    def __init__(self):
        self.sessions = defaultdict(list)
        self.flow_state = {}

    def add_message(self, session_id: str, role: str, message):
        self.sessions[session_id].append({
            "role": role,
            "message": message
        })

    def get_messages(self, session_id: str):
        return self.sessions[session_id]

    def set_flow_state(self, session_id: str, state: dict):
        self.flow_state[session_id] = state

    def get_flow_state(self, session_id: str):
        return self.flow_state.get(session_id)

    def clear_flow_state(self, session_id: str):
        self.flow_state.pop(session_id, None)


# SINGLE GLOBAL INSTANCE (IMPORTANT FIX)
context_manager = ContextManager()