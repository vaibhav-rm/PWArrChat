import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export function ChatApp() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load user's chats
    const loadChats = async () => {
      const q = query(collection(db, 'chats'), where('participants', 'array-contains', auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      const loadedChats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(loadedChats);
    };
    loadChats();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;

    // Search for user by email
    const q = query(collection(db, 'users'), where('email', '==', searchTerm));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      // Check if chat already exists
      const existingChat = chats.find(chat => chat.participants.includes(user.email));
      if (existingChat) {
        setSelectedChat(existingChat);
      } else {
        // Create new chat
        const newChat = {
          participants: [auth.currentUser.email, user.email],
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'chats'), newChat);
        const chatWithId = { id: docRef.id, ...newChat };
        setChats([...chats, chatWithId]);
        setSelectedChat(chatWithId);
      }
    } else {
      alert('User not found');
    }
  };

  return (
    <div className="flex h-screen bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
      <Sidebar 
        chats={chats} 
        onSelectChat={setSelectedChat} 
        onSearch={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ChatArea selectedChat={selectedChat} />
    </div>
  );
}