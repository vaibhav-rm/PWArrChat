import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import db
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL
      });

      await setDoc(doc(db, "userChats", user.id), {});

      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="h-screen flex items-center justify-center">
      <Box className="bg-black bg-opacity-70 p-8 rounded-lg backdrop-filter backdrop-blur-sm">
        <Typography component="h1" variant="h5" className="text-white mb-4">
          Sign up
        </Typography>
        <form onSubmit={handleSignup} className="space-y-4">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 rounded-md text-white"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 rounded-md text-white"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white"
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" className="mt-4 text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400">Sign In</Link>
        </Typography>
      </Box>
    </Container>
  );
}
