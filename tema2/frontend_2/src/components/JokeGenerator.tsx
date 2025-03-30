import { useEffect, useState } from "react"


import {Button, Container, Row, Col } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

const JokeGenerator = () => {
    const [setup, setSetup] = useState()
    const [delivery, setDelivery] = useState()

    const [visible, setVisible] = useState(false)

    const getJoke = async() => {

        var val = undefined
        var token = localStorage.getItem('token')
        while( val === undefined)
            {
            const response = await fetch("http://127.0.0.1:5000/joke",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                
            })
            const data = await response.json()
    
            val = data.setup
            setSetup(data.setup)
            setDelivery(data.delivery)
            setVisible(false)
        }
    }

    useEffect(() => {
        getJoke()
    }, []);

    return (
        <Container>
            <Row  className="mt-auto text-muted mb-2">
                <Col  onMouseEnter={() => setVisible(true)}>{setup}</Col>
            </Row>
            <Container style={{opacity: visible ? 1 : 0, transition: "opacity 0.1s ease-in-out"}}>
                <Row>
                    <Col className={visible ? "" : "pe-none"}>{delivery}</Col>
                </Row>
                <Row>
                    <Col><Button className={visible ? "btn-sm" : "btn-sm disabled"} variant="secondary" onClick={getJoke}>Regenerate</Button></Col>
                </Row>
            </Container>
        </Container>
    )
}

export default JokeGenerator;