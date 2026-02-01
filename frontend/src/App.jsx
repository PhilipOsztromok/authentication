import { createContext, useContext, useState, useEffect } from 'react';
import './App.css';

// pages
import Login from './pages/login.jsx';
import Register from './pages/signup.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// ==================
// AUTH CONTEXT
// ==================
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ==================
// API
// ==================
import { authAPI } from './api';

// ==================
// PROVIDER
// ==================
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================
// APP
// ==================
function App() {
  const [view, setView] = useState('login');
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/app/passwordReset/')) {
      const token = path.split('/').pop();
      if (token) {
        setResetToken(token);
        setView('resetPassword');
      }
    }
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {view === 'login' && (
          <Login
            onSwitchToRegister={() => setView('register')}
            onSwitchToForgotPassword={() => setView('forgotPassword')}
          />
        )}

        {view === 'register' && (
          <Register onSwitchToLogin={() => setView('login')} />
        )}

        {view === 'forgotPassword' && (
          <ForgotPassword onBack={() => setView('login')} />
        )}

        {view === 'resetPassword' && (
          <ResetPassword token={resetToken} onDone={() => setView('login')} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;

