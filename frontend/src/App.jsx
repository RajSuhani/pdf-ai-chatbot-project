import { useState } from "react";
import ChatBox from "./components/ChatBox";
import UploadBox from "./components/UploadBox";
import "./App.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      title: "Chat 1",
      messages: []
    }
  ]);

  const [activeChat, setActiveChat] = useState(1);

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: []
    };

    setChatSessions([newChat, ...chatSessions]);
    setActiveChat(newChat.id);
  };

  const deleteChat = (id) => {
    const updated = chatSessions.filter((c) => c.id !== id);

    setChatSessions(updated);

    if (activeChat === id && updated.length > 0) {
      setActiveChat(updated[0].id);
    }
  };

  const renameChat = (id) => {
    const newTitle = prompt("Enter new chat name:");

    if (!newTitle) return;

    setChatSessions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title: newTitle } : c
      )
    );
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>

      <div className="sidebar">
        <h2>📄 PDF AI</h2>

        <button className="new-chat" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="chat-list">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                activeChat === chat.id ? "active" : ""
              }`}
              onClick={() => setActiveChat(chat.id)}
            >

              <span>💬 {chat.title}</span>

              <div className="chat-actions">
                <button onClick={() => renameChat(chat.id)}>✏️</button>
                <button onClick={() => deleteChat(chat.id)}>🗑️</button>
              </div>

            </div>
          ))}
        </div>

        <div className="toggle">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            Dark Mode
          </label>
        </div>
      </div>

      <div className="main">
        <UploadBox />

        <ChatBox
          chatSessions={chatSessions}
          setChatSessions={setChatSessions}
          activeChat={activeChat}
        />
      </div>

    </div>
  );
}