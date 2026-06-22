import { useState } from "react";
import "../../styles/Ai.css";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sessionId = "1";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: input,
          token: "abc123",
        }),
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data?.response?.reply || "No response",
        data: data?.response?.data,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Server error" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="ai-container">
      {/* HEADER */}
      <div className="ai-header">
        Biz360 AI Assistant
      </div>

      {/* CHAT AREA */}
      <div className="ai-chat">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`msg ${msg.role === "user" ? "user" : "bot"}`}
          >
            <div>{msg.text}</div>

            {msg.data && (
              <pre className="msg-data">
                {JSON.stringify(msg.data, null, 2)}
              </pre>
            )}
          </div>
        ))}

        {loading && <div className="typing">AI thinking...</div>}
      </div>

      {/* INPUT AREA */}
      <div className="ai-input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your ERP AI..."
          className="ai-input"
        />

        <button onClick={sendMessage} className="ai-button">
          Send
        </button>
      </div>
    </div>
  );
}