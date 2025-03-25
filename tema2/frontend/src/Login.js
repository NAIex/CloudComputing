
import {useState} from "react";
import { useNavigate } from "react-router-dom";

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Button, Alert, Form, Container, Row, Col} from 'react-bootstrap'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loginState, setLoginState] = useState(-1)
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username,password}),
        });

        const data = await response.json()

        if (response.ok){
            localStorage.setItem("token",data.access_token);
            navigate("/dashboard")
        }else{
            setLoginState(0)
        }
    }

    return (
        <div className="App">
            <div className="App-header">
                <Form>
                    <Form.Label>Login Information</Form.Label>
                    <Form.Group className="mt-2">
                        <Form.Control type='text' placeholder='MyUsername' onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Control type='password' onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Button className="mt-2" type="button" onClick={handleLogin}>Login</Button>
                </Form>
                {
                    loginState === 0 && 
                    <Alert variant='danger'>Login failed!</Alert>
                }
            </div>
        </div>
    )
}

export default Login;

