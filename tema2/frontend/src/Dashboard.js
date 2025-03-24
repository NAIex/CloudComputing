import { useState } from "react"; 
import { useEffect } from "react";

import BACKEND from "./Constants"

import React from "react";
import { Container, Row, Col, Navbar, Nav, Card, Form, FormGroup, Button } from "react-bootstrap";
import { FaChartPie, FaUsers, FaCog } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function HEADERS_AUTHORIZED(token){
    return {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
    }
}
const Dashboard = () => {
    const [name, setName] = useState()
    const token = localStorage.getItem('token')

    const [employees, setEmployees] = useState([])
    
    const [addingEmployee, setAddingEmployee] = useState(false)

    const getEmployees = async() => {
        const result = await fetch(`${BACKEND}/employees`,{
            method: "GET",
            headers: HEADERS_AUTHORIZED(token)
        })

        const data = await result.json()
        setEmployees(data.data)
    }
    const addNewEmployee = async() => {
        const result = await fetch(`${BACKEND}/employees`,{
            method:"POST",
            headers: HEADERS_AUTHORIZED(token),
            body: JSON.stringify({"name":name,"role_id":1})
            })

        const data = await result.json()
        console.log(data)


    }

    const changeEmployee = async(name) => {
        setName(name)
        setAddingEmployee(false)
    }
    const addEmployee = async() => {
        setAddingEmployee(true)
    }


    useEffect(() =>{
        getEmployees()
    })


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
        <h4 className="text-center"><FaUsers/> Users</h4>
        <Nav className="flex-column" style={{alignItems:"center"}}>
        {
            employees.map((employee) => (
            <Nav.Link onClick={() => changeEmployee(employee.name)}>{employee.name}</Nav.Link>
            ))
        }
        <Nav.Link onClick={() => addEmployee()}>Add Employee</Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Navbar bg="light" className="mb-3">
          <Container>
            <Navbar.Brand>User DashBoard</Navbar.Brand>
          </Container>
        </Navbar>

        <Container className="d-flex flex-column">
          <Row className="g-4">
            {
            addingEmployee ? 
            <Col md={4}>
                <Form>
                    <FormGroup>
                        <Form.Control type="text" placeholder="John Smith" onChange={(e) => setName(e.target.value)}/>
                    </FormGroup>
                </Form>
            </Col>
            :
            <Col><h3>{name}</h3></Col>
            }
          </Row>
          <Row className="mt-auto align-items-end g-4">
            {
                addingEmployee && 
                <Col md={4}>
                    <Form>
                        <Button onClick={addNewEmployee}>Save</Button>
                    </Form>
                </Col>
            }
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
