import { useContext, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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

  return (
    <>
             
    </>
  )



}

export default App
