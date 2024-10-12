import React, { useState, useEffect, useContext } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Import this method
import { AuthContext } from './context/AuthContext';

export function ChatApp() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const [user, setUser] = useState(null);

    const {currentUser} = useContext(AuthContext);

    const handleSelect = async () => {
        if (!user || !currentUser) return;

        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

        try {
            const chatRef = doc(db, "chats", combinedId);
            const res = await getDoc(chatRef);

            if (!res.exists()) {
                // Create a new chat
                await setDoc(chatRef, { messages: [] });

                // Update current user's chat
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [`${combinedId}.userInfo`]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [`${combinedId}.date`]: serverTimestamp()
                });

                // Update selected user's chat
                await updateDoc(doc(db, "userChats", user.uid), {
                    [`${combinedId}.userInfo`]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [`${combinedId}.date`]: serverTimestamp()
                });
            }
        } catch (err) {
            console.error('Error creating or updating chat:', err);
        }

        setUser(null);
        setSearchTerm('');

    };
      
    

    const handleSearch = async () => {
        if (!searchTerm.trim()) return; // Ensure non-empty input

        const q = query(collection(db, "users"), where("displayName", "==", searchTerm));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    setUser(doc.data());
                });
            } else {
                console.log('User not found');
            }
        } catch (err) {
            console.error(err);
        }
    };


    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    }

    useEffect(() => {
        // Check if user is authenticated
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // If the user is logged in, load chats
                loadChats();
            } else {
                // If not logged in, redirect to login page
                window.location.href = '/login'; // Replace with your login page route
            }
            setLoading(false); // Stop loading once auth state is determined
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const loadChats = async () => {
        try {
            const q = query(collection(db, 'chats'), where('participants', 'array-contains', auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            const loadedChats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChats(loadedChats);
        } catch (error) {
            console.error('Error loading chats:', error);
        }
    };

    //   const handleSearch = async () => {
    //     if (searchTerm.trim() === '') return;

    //     const q = query(collection(db, 'users'), where('email', 'userChats==', searchTerm));
    //     const querySnapshot = await getDocs(q);

    //     if (!querySnapshot.empty) {
    //       const user = querySnapshot.docs[0].data();
    //       const existingChat = chats.find(chat => chat.participants.includes(user.email));
    //       if (existingChat) {
    //         setSelectedChat(existingChat);
    //       } else {
    //         const newChat = {
    //           participants: [auth.currentUser.email, user.email],
    //           createdAt: serverTimestamp()
    //         };
    //         const docRef = await addDoc(collection(db, 'chats'), newChat);
    //         const chatWithId = { id: docRef.id, ...newChat };
    //         setChats([...chats, chatWithId]);
    //         setSelectedChat(chatWithId);
    //       }
    //     } else {
    //       alert('User not found');
    //     }
    //   };

    if (loading) return <div>Loading...</div>; // Display loading while checking auth state

    return (
        <div className="flex h-screen bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
            <Sidebar
                chats={chats}
                onSelectChat={setSelectedChat}
                onSearch={handleSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleKey={handleKey}
                user={user}
                handleSelect={handleSelect}
            />
            <ChatArea selectedChat={selectedChat} />
        </div>
    );
}
