import React, {useEffect, useState} from "react";
import { Button, Col, Container, FormControl, Row } from "react-bootstrap";
import { fetchEmployeeData, createEmployee, updateEmployeeSchedule, deleteEmployee } from "../utils/api";

interface Props{
    employee? : {name:string,email:string,id:string},
    onSave? : () => void,
    onRemove? : () => void
}

const defaultSchedule = {
    monday: { "0": false, "1": false },
    tuesday: { "0": false, "1": false },
    wendsday: { "0": false, "1": false },
    thursday: { "0": false, "1": false },
    friday: { "0": false, "1": false },
    saturday: { "0": false, "1": false },
    sunday: { "0": false, "1": false },
};

const EmployeeDetails = ({employee, onSave, onRemove} : Props) => {
    const token = localStorage.getItem('token');
    const [name, setName] = useState(employee?.name || "");
    const [email, setEmail] = useState(employee?.email || "");
    const [schedule, setSchedule] = useState(defaultSchedule);

    

    useEffect(() => {
        
        if(employee){
            setSchedule(defaultSchedule)
            setName(employee.name)
            setEmail(employee.email)

            fetchEmployeeData(employee.id,token).then(setSchedule)
        }
        else{
            setSchedule(defaultSchedule)
            setName('')
            setEmail('')
        }
        console.log(employee)
        
    },[employee])

    function toggleSchedule(day : string, interval:string){
        setSchedule((prev) => ({
            ...prev,
            [day] : {...prev[day], [interval] : !prev[day][interval]}
        }))
    }
    function handleSave(){
        if(employee){
            updateEmployeeSchedule(employee.id,schedule,token);
        }else{
            createEmployee(name,email,token);
        }
        onSave?.()
    }
    function handleRemove(){
        if(employee){
            deleteEmployee(employee.id,token)
        }
        onRemove?.()
    }

    return (
        <Container>
            <Row>
                
                <Col md="6">
                    <FormControl
                    className="mt-2"
                    type="text"
                    placeholder="name"
                    value={name}
                    disabled={employee!==undefined}
                    onChange={(e) => setName(e.target.value)}
                    />
                    <FormControl
                    className="mt-2"
                    type="text"
                    placeholder="Email"
                    value={email}
                    disabled={employee!==undefined}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </Col>
            </Row>

            <Row className="pt-2">
                {["monday","tuesday","wendsday","thursday","friday","saturday","sunday"].map((day) => (
                    <Row key={day}>
                        <Col md="2">{day}</Col>
                        {[0,1].map((interval) => (
                            <Col 
                            md="2"
                            key={interval}
                            className={`mx-2 btn btn-${schedule[day][interval] ? "success" : "danger"}`} 
                            onClick={() => toggleSchedule(day,interval)}
                            
                            >
                            {schedule[day][interval] ? "Available" : "-"}
                            </Col>
                        ))}
                    </Row>
                ))}
            </Row>
            <Row className="mt-2">
                <Col md="1">
                    <Button variant="success" onClick={handleSave}>Save.</Button>
                </Col>
                <Col md="3">
                    <Button variant="danger" onClick={handleRemove}>Remove Employee.</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default EmployeeDetails