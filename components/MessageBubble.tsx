"use client";

import { motion } from "framer-motion";

interface Props {
  sender: "user" | "bot";
  text: string;
}

export default function MessageBubble({ sender, text }: Props) {
  const isUser = sender === "user";

  // Format the bot message with HTML for readability
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics
    .replace(/(\d+)\.\s/g, "<br/><strong>$1.</strong> ") // Numbered list
    .replace(/\n/g, "<br/>"); // Line breaks

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm leading-relaxed text-sm ${
          isUser
            ? "bg-blue-600 text-white self-end"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    </motion.div>
  );
}
