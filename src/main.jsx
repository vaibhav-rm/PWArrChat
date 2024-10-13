import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './components/context/AuthContext'
import { ChatContextProvider } from './components/context/ChatContext'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>,
)
