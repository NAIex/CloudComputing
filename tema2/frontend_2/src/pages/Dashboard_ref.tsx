import React, { useEffect, useState } from "react";
import { fetchEmployees, sendEmail } from "../utils/api";
import { Navigate } from "react-router-dom";
import { Button, Col, Container, Navbar, Row } from "react-bootstrap";
import EmployeeList from "./EmployeeList";
import EmployeeDetails from "./EmployeeDetails";
import JokeGenerator from "../components/JokeGenerator";


const Dashboard = () => {
    const token = localStorage.getItem('token');

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchEmployees(token).then(setEmployees);
    }, [token])

    function handleEmployeeSelect(employee){
        if (employee.id === -1){
            setIsAdding(true);
            setSelectedEmployee(null);
        }else{
            setIsAdding(false);
            setSelectedEmployee(employee);
        }
    }

    return token == null ?(
        <Navigate to={"/"} replace />
    ) : (
        <Container className="vh-100 vw-100">
            <Row className="vh-100">
                <Col md="2" className="bg-info pt-5 px-2">
                    <EmployeeList employees={employees} onSelect={handleEmployeeSelect}/>
                    <Button className="mt-2" onClick={() => sendEmail(token)}>Send e-mail to employees.</Button>
                </Col>
                <Col md="10">
                    <Navbar>
                       <h1>Dashboard</h1>
                    </Navbar>
                    { isAdding ? (
                        <EmployeeDetails onSave={() => setIsAdding(false)} onRemove={() => setIsAdding(false)} />
                    ) : selectedEmployee ? (
                        <EmployeeDetails employee={selectedEmployee} />
                    ) : (
                        <p>Select an employee to view details.</p>
                    )}
                    <Row className="position-absolute bottom-0">
                        <Col>
                            <JokeGenerator/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Dashboard