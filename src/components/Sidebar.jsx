import React, { useState } from 'react';
import { Search, Plus, MoreVertical } from 'lucide-react';

export function Sidebar({ onSelectChat }) {
  const [searchTerm, setSearchTerm] = useState('');

  const chats = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'Hey, how are you?', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Bob Smith', lastMessage: 'Can we meet tomorrow?', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Carol Williams', lastMessage: 'Thanks for your help!', time: 'Tuesday', unread: 1 },
  ];

  return (
    <div className="w-1/4 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm border-r border-gray-800">
      <div className="p-4 bg-black bg-opacity-80 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Chats</h1>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Plus size={20} className="text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <MoreVertical size={20} className="text-gray-300" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-140px)]">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 hover:bg-gray-800 hover:bg-opacity-30 cursor-pointer transition-colors"
            onClick={() => onSelectChat(chat)}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
              {chat.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{chat.name}</h3>
              <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{chat.time}</p>
              {chat.unread > 0 && (
                <span className="bg-gray-600 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}