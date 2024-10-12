import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Send as SendIcon } from 'lucide-react';

export function ChatArea({ selectedChat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (selectedChat) {
      const q = query(collection(db, `chats/${selectedChat.id}/messages`), orderBy('createdAt'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, `chats/${selectedChat.id}/messages`), {
      text: newMessage,
      createdAt: serverTimestamp(),
      sender: auth.currentUser.email
    });

    setNewMessage('');
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
            {selectedChat.participants.find(p => p !== auth.currentUser.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-white">{selectedChat.participants.find(p => p !== auth.currentUser.email)}</h2>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === auth.currentUser.email ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.sender === auth.currentUser.email 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white' 
                  : 'bg-gray-800 bg-opacity-50 text-white'
              }`}
            >
              <p>{message.text}</p>
              <div className="text-xs text-gray-400 mt-1">
                {message.createdAt?.toDate().toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="bg-black bg-opacity-80 p-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 py-2 px-4 bg-gray-800 bg-opacity-50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-colors"
        >
          <SendIcon size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
}