import React, { useState } from 'react'
import { Alert, Button, Card, Container, FormControl, FormGroup, Row } from 'react-bootstrap'
import { Form, useAsyncError, useNavigate, useSubmit } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [alertInfo, setAlertInfo] = useState('')

    async function checkLogin(){
        let success = email !== '' && password !== ''

        let response  = await fetch('http://127.0.0.1:5000/login',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"email":email,"password":password})
        })

        let result = await response.json();
        let mess = result['message'];
        let token = result['token'];
        let code = await response.status

        if(code == 200){
            localStorage.setItem('token',token)
            setAlertInfo("Login success!")
            navigate('/dashboard')
        }
        else{
            setAlertInfo(`${mess}`)
        }
    }

  return (
    <>
    <Container className='mt-5' style={{width:"25vw"}}>
        <Row className='mb-2 text-center'>
            <h1>Login</h1>
        </Row>
        <Row className='mb-2'>
            <FormGroup>
                <FormControl onChange={(event) => setEmail(event.target.value)} type='email' placeholder='john@lennon.com'></FormControl>
            </FormGroup>
            <FormGroup>
                <FormControl onChange={(event) => setPassword(event.target.value)} type='password' placeholder='sillypassword'></FormControl>
            </FormGroup>
        </Row>
        <Row className='mb-2'>
            <Button variant='primary' type='submit' onClick={checkLogin}>Submit</Button>
        </Row>
        {alertInfo && <Alert variant='info'>{alertInfo}</Alert>}
    </Container>
    
    </>
  )
}

export default Login
