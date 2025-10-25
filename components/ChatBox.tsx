"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";

type Msg = { sender: "user" | "bot"; text: string };

export default function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      sender: "bot",
      text: "👋 Hi, I’m HealthBuddy! Tell me your symptoms and how long they’ve lasted.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    // ✅ Explicitly type the new message
    const userMessage: Msg = { sender: "user", text: input };
    const newMsgs: Msg[] = [...messages, userMessage];

    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // ✅ Type the bot message as Msg too
      const botMessage: Msg = { sender: "bot", text: data.reply };
      setMessages([...newMsgs, botMessage]);
    } catch {
      const errorMessage: Msg = {
        sender: "bot",
        text: "Sorry, I couldn’t respond. Try again.",
      };
      setMessages([...newMsgs, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-white border rounded-2xl shadow p-4">
      <div className="flex-1 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <MessageBubble key={i} sender={m.sender} text={m.text} />
        ))}
        {loading && <MessageBubble sender="bot" text="HealthBuddy is typing..." />}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Describe your symptoms..."
          className="flex-1 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={send}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          disabled={loading}
        >
          Send
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        ⚠️ HealthBuddy provides general guidance only — not medical advice.
      </p>
    </div>
  );
}
