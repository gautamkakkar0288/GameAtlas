import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './store'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#10122B',
              color: '#F8FAFC',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontFamily: 'Outfit, sans-serif',
            },
            success: { iconTheme: { primary: '#6D28D9', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
