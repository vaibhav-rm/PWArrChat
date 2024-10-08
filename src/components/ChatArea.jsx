import React, { useState } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';

export function ChatArea({ selectedChat }) {
  const [message, setMessage] = useState('');

  const messages = [
    { id: 1, sender: 'Alice', content: 'Hey, how are you?', time: '10:30 AM', status: 'read' },
    { id: 2, sender: 'You', content: 'I m doing great, thanks! How about you?', time: '10:31 AM', status: 'sent' },
    { id: 3, sender: 'Alice', content: 'I m good too. Do you want to grab lunch later?', time: '10:32 AM', status: 'read' },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm">
        <p className="text-2xl text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm">
      <div className="bg-black bg-opacity-80 border-b border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3">
            {selectedChat.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-white">{selectedChat.name}</h2>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Phone size={20} className="text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Video size={20} className="text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <MoreVertical size={20} className="text-gray-300" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                msg.sender === 'You' 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white' 
                  : 'bg-gray-800 bg-opacity-50 text-white'
              }`}
            >
              <p>{msg.content}</p>
              <div className="flex justify-end items-center mt-1 space-x-1">
                <span className="text-xs opacity-75">{msg.time}</span>
                {msg.sender === 'You' && (
                  <span className="text-xs">
                    {msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : '✓✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-black bg-opacity-80 p-4 flex items-center space-x-2">
        <button  className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Paperclip size={20} className="text-gray-300" />
        </button>
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 py-2 px-4 bg-gray-800 bg-opacity-50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Smile size={20} className="text-gray-300" />
        </button>
        <button
          className="p-2 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-colors"
          onClick={handleSend}
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}