import { useState, useRef, useEffect } from "react";
import { askQuestion } from "../api";

export default function ChatBox({
  chatSessions,
  setChatSessions,
  activeChat
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSessions, activeChat, loading]);

  const currentChat = chatSessions.find(
    (c) => c.id === activeChat
  );

  const messages = currentChat?.messages || [];

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userQ = question;

    const updated = chatSessions.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { type: "user", text: userQ }
          ]
        };
      }
      return chat;
    });

    setChatSessions(updated);
    setQuestion("");
    setLoading(true);

    try {
      const res = await askQuestion({ question: userQ });

      const finalUpdate = updated.map((chat) => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                type: "bot",
                text: res.data.answer,
                sources: res.data.sources || []
              }
            ]
          };
        }
        return chat;
      });

      setChatSessions(finalUpdate);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        📄 {currentChat?.title || "Chat"}
      </div>

      <div className="chat-box">

        {messages.length === 0 && (
          <div className="empty-state">
            Ask anything from your PDF 👇
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.type}`}>
            <div className="bubble">

              {msg.type === "user" ? (
                msg.text
              ) : (
                <>
                  <b>Answer:</b>
                  <div style={{ marginTop: "5px" }}>
                    {msg.text}
                  </div>

                  {msg.sources?.length > 0 && (
                    <div className="sources-box">
                      <b>Sources:</b>

                      {msg.sources.map((s, idx) => (
                        <div key={idx} className="source-item">
                          📄 Page {s.page}
                          <br />
                          <small>{s.excerpt}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        ))}

        {loading && (
          <div className="msg bot">
            <div className="bubble typing">
              🤖 AI is thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask from PDF..."
        />

        <button onClick={handleAsk}>
          Send
        </button>
      </div>

    </div>
  );
}