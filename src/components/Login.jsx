import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase'; // Import db
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email
      });
      navigate('/chat');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email
      });
      navigate('/chat');
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="h-screen flex items-center justify-center">
      <Box className="bg-black bg-opacity-70 p-8 rounded-lg backdrop-filter backdrop-blur-sm">
        <Typography component="h1" variant="h5" className="text-white mb-4">
          Sign in
        </Typography>
        <form onSubmit={handleLogin} className="space-y-4">
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
            autoComplete="current-password"
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
            Sign In
          </Button>
        </form>
        <Button
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        >
          Sign in with Google
        </Button>
        <Typography variant="body2" className="mt-4 text-gray-400">
          Don't have an account? <Link to="/signup" className="text-blue-400">Sign Up</Link>
        </Typography>
      </Box>
    </Container>
  );
}
