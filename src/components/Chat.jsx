import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Button, TextField, Typography, Container, Box, List, ListItem, ListItemText } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      createdAt: new Date(),
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || auth.currentUser.email
    });

    setNewMessage('');
  };

  return (
    <Container className="h-screen flex flex-col">
      <Box className="flex-grow overflow-auto bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 rounded-lg">
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} className={`${message.uid === auth.currentUser.uid ? 'justify-end' : 'justify-start'}`}>
              <Box className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.uid === auth.currentUser.uid 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white' 
                  : 'bg-gray-800 bg-opacity-50 text-white'
              }`}>
                <ListItemText 
                  primary={message.displayName}
                  secondary={message.text}
                  secondaryTypographyProps={{ className: 'text-gray-300' }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box component="form" onSubmit={handleSendMessage} className="mt-4 flex">
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="bg-gray-800 rounded-l-md text-white"
        />
        <Button 
          type="submit" 
          variant="contained" 
          endIcon={<SendIcon />}
          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-r-md"
        >
          Send
        </Button>
      </Box>
    </Container>
  );
}