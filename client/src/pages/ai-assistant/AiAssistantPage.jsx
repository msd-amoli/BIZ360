import { useState } from "react";
import { sendAiMessage } from "../../services/api";
import "../../styles/Ai.css";

export default function AiAssistantPage() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {

      const res = await sendAiMessage(input);

      const aiMsg = {
        role: "ai",
        text: res.data.message,
        data: res.data.data,
        suggestions: res.data.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {

      setMessages(prev => [...prev, {
        role: "ai",
        text: "⚠️ AI Service error. Please try again."
      }]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">

      {/* CHAT MESSAGES */}
      <div className="chat-box">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "ai"}`}
          >

            <div className="message-text">{msg.text}</div>

            {msg.data && (
              <pre className="message-data">
                {JSON.stringify(msg.data, null, 2)}
              </pre>
            )}

            {msg.suggestions && (
              <div className="suggestions">
                {msg.suggestions.map((s, i) => (
                  <button key={i} className="suggestion-btn">
                    {s}
                  </button>
                ))}
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="loading">AI is thinking...</div>
        )}

      </div>

      {/* INPUT AREA */}
      <div className="input-box">

        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask ERP Assistant..."
        />

        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}