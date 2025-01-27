import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://lyfchat.onrender.com'); // Replace with your backend URL

function Chat({ practitioner }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit('message', { content: message, sender: 'user' });
    setMessage('');
  };

  return (
    <div>
      <h1>Chat with {practitioner.name}</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.content}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
