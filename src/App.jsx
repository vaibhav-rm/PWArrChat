import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ChatApp } from './components/ChatApp';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function PrivateRoute({ children }) {
  const [user] = useAuthState(auth);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <style jsx global>{`
          @keyframes backgroundMove {
            0% { background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; }
            100% { background-position: 1000px 0, 1040px 60px, 1130px 270px, 1070px 100px; }
          }
        `}</style>
        <div 
          className="fixed inset-0 overflow-hidden pointer-events-none"
          style={{
            backgroundColor: 'black',
            backgroundImage: `
              radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
              radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
              radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
              radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px)
            `,
            backgroundSize: '550px 550px, 350px 350px, 250px 250px, 150px 150px',
            backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px',
            animation: 'backgroundMove 60s linear infinite',
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <ChatApp />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}