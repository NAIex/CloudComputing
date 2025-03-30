
import { Button, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";


const Day = ({name, availability, func, id}, ref) => {

    const interval1 = availability[id][0] === true ? "Available" : "Unvailable";
    const interval2 = availability[id][1] === true ? "Available" : "Unvailable";

    return (
    <Row className="mx-2">
        <Col className="border border-success">{name}</Col>
        <Col className="border border-info">
            <Button onClick={() => func(id,0)} variant={availability[id][0] ? "success" : "danger"}style={{width:"100%"}}>{interval1}</Button>
        </Col>
        <Col className="border border-info">
            <Button onClick={() => func(id,1)} variant={availability[id][1] ? "success" : "danger"} style={{width:"100%"}}>{interval2}</Button>
        </Col>
    </Row>
    )
}

const Week = () => {
    let rows = [];
    let days = ['Mo','Tu','We','Th','Fr','Sa','Su'];

    const [availability,setAvailability] = useState(Array.from({length:7}, () => Array(2).fill(false)))
    console.log(availability)
    function changeAvailability(row,col) {
        console.log(availability)
        let cp = availability.slice()
        
        cp[row][col] = !cp[row][col]

        setAvailability(cp)
    }

    rows.push(
    <Row className="mx-2 text-center">
        <Col className="border border-success">Day</Col>    
        <Col className="border border-info">Interval 1</Col>    
        <Col className="border border-info">Interval 2</Col>    
    </Row>
    )

    for (let index = 0; index < days.length; index++) {
        const element = days[index];
        rows.push(<Day key={index} id={index} func={changeAvailability} name={element} availability={availability}></Day>)
    }
    return rows
}

export default Week