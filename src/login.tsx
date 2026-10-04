import { useState } from 'react'
import "./login.css"


const Login = ({ onLogin }: { onLogin: (user: {idInstance: string, apiTokenInstance: string}) => void }) => {
    const [idInstance, setIdInstance] = useState("");
    const [apiTokenInstance, setApiTokenInstance] = useState("");

    const handleLogin = () => {
        onLogin({idInstance, apiTokenInstance});
    }

  return (
    <div className="login-container">
        <input onChange={(e) => setIdInstance(e.target.value)} type="text" placeholder="idInstance" />
        <input onChange={(e) => setApiTokenInstance(e.target.value)} type="password" placeholder="apiTokenInstance" />
        <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login