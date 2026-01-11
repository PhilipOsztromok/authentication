import { useContext,createContext, useState } from 'react'
import './App.css'

function App() {

  const apiBaseURL = 'http://localhost:3000/api/v1';
  const AuthContext = createContext(null);
  
  const authProvider = ( {children} ) => {
    const [user, setUser] = useState(null);
    return(
      <AuthContext.Provider value={ {user} }>
        {children}
      </AuthContext.Provider>
    )
  }

  const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("Use auth must be used within an AuthProvider!");
    return context;
  }

  const authAPI = {
    signup: async(data) => {
      const response = await fetch(`${apiBaseURL}/signup`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      })

      return response.json();

    },

    login: async(data) => {
      const response = await fetch(`${apiBaseURL}/login`, {
        credentials:"include",
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
      })

      return response.json();

    },

    logout: async() => {
      const response = await fetch(`${apiBaseURL}/logout`, {
        credentials:"include",
        method:"POST"
      })

      return response.json();

    },

    forgot_password: async(email_address) => {
      const response = await fetch(`${apiBaseURL}/forgot_password`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify( {email_address} )
      })

      return response.json();

    },
    
  }

 const [view, setView] = useState('login'); // login, register, forgotPassword, resetPassword
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setView('resetPassword');
    }
  }, []);

  return (
    <AuthProvider>
      <AuthContent view={view} setView={setView} resetToken={resetToken} />
    </AuthProvider>
  );
};

const AuthContent = ({ view, setView, resetToken }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );

  if (user) return <Dashboard />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-50">
      {view === 'login' && <Login onSwitchToRegister={() => setView('register')} onSwitchToForgot={() => setView('forgotPassword')} />}
      {view === 'register' && <Register onSwitchToLogin={() => setView('login')} />}
      {view === 'forgotPassword' && <ForgotPassword onBack={() => setView('login')} />}
      {view === 'resetPassword' && <ResetPassword token={resetToken} />}
    </div>
  );
};





export default App
