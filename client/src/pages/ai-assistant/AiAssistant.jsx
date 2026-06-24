import { useState, useEffect, useRef } from "react";
import "../../styles/Aiassist.css";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
const chatEndRef = useRef(null);
  const sessionId = "1";
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);
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
          token: localStorage.getItem("token"),
        }),
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data?.response?.reply || "No response",
        data: data?.response?.data,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Server error" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="ai-bubble"
          onClick={() => setIsOpen(true)}
        >
          ✨
        </button>
      )}

      {isOpen && (
        <div className="ai-widget">
          <div className="ai-widget-header">
            <span>Biz<sup>o</sup> AI</span>

            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="ai-widget-chat">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`msg ${
                  msg.role === "user" ? "user" : "bot"
                }`}
              >
                <div>{msg.text}</div>

                {msg.data && (
                  <pre className="msg-data">
                    {JSON.stringify(msg.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}

            {loading && (
              <div className="typing">
                AI thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="ai-widget-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI..."
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}