import { useEffect, useRef, useState } from "react";
import socket from "../lib/socket";

export default function Chat({ roomId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);

  // Listen for messages and history from socket
  useEffect(() => {
    // Server sends full history when you join
    socket.on("chat-history", (history) => {
      setMessages(history);
    });

    // Incoming message from anyone in the room
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("chat-message");
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;

    socket.emit("chat-message", { roomId, message: msg });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">

      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-600 text-center mt-6">No messages yet. Say hello! 👋</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userName === currentUser;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {/* Name + time */}
                <span className="text-[10px] text-gray-600 mb-0.5 px-1">
                  {isMe ? "You" : msg.userName} · {msg.time}
                </span>
                {/* Bubble */}
                <div className={`max-w-[90%] px-3 py-1.5 rounded-xl text-sm break-words ${
                  isMe
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-gray-800 text-gray-200 rounded-tl-sm"
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 mt-3 flex-shrink-0">
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-3 py-2 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs px-3 py-2 rounded-lg transition"
        >
          ↑
        </button>
      </form>
    </div>
  );
}
