import { useEffect, useState } from "react"


import {Button, Container, Row, Col } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

const JokeGenerator = () => {
    const [setup, setSetup] = useState()
    const [delivery, setDelivery] = useState()

    const [visible, setVisible] = useState(false)

    const getJoke = async() => {

        var val = undefined
        
        while( val === undefined)
            {
            const response = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
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
        <Container className="mt-auto text-muted mb-2">
            <Row>
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