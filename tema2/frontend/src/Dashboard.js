import { useState } from "react"; 
import { useEffect } from "react";

import {BACKEND} from "./Constants"

import React from "react";
import { Container, Row, Col, Navbar, Nav, Card, Form, FormGroup, Button } from "react-bootstrap";
import { FaChartPie, FaUsers, FaCog } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";


import JokeGenerator  from "./JokeGenerator"
import Week from "./Week";

function HEADERS_AUTHORIZED(token){
    return {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
    }
}
const Dashboard = () => {
    const [employees, setEmployees] = useState([])

    const [name, setName] = useState()
    const [id, setID] = useState()
    
    const token = localStorage.getItem('token')

    
    const new_employee = "NEW"
    const old_employee = "OLD"

    const [visualize, setVisualize] = useState('')

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
    const removeEmployee = async() => {
        const result = await fetch(`${BACKEND}/employees`, {
            method:"DELETE",
            headers:HEADERS_AUTHORIZED(token),
            body:JSON.stringify({"id":id})
        })
        const data = await result.json()
        console.log(data)
    }
    

    const changeEmployee = async(name, id) => {
        setName(name)
        setID(id)
        setVisualize(old_employee)
    }
    const addEmployee = async() => {
        setVisualize(new_employee)
    }


    useEffect(() =>{
        getEmployees()
    })


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 min-vh-90" style={{ width: "250px" }}>
        <h4 className="text-center"><FaUsers/> Employees</h4>
        <Nav className="d-flex flex-column vh-100" style={{alignItems:"center"}}>
        {
            employees.map((employee) => (
            <Nav.Link onClick={() => changeEmployee(employee.name,employee.id)}>{employee.name}</Nav.Link>
            ))
        }
        <Nav.Link onClick={() => addEmployee()}>Add Employee</Nav.Link>
        <Button className="mt-auto" variant="success">Generate Schedule</Button>
        
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Navbar bg="light" className="mb-3">
          <Container>
            <Navbar.Brand>Employee DashBoard</Navbar.Brand>
          </Container>
        </Navbar>

        <Container className="d-flex flex-column min-vh-100">
          <Row className="g-4">
            {
            visualize === new_employee ? 
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
          {/* Schedule visualizer */}
          {visualize === old_employee && <Week></Week>}

          {/* Buttons */}
          <Row className="align-items-end g-4">
            {
                visualize === new_employee && 
                <>
                <Col md={4}>
                    <Form>
                        <Button className="btn-success" onClick={addNewEmployee}>Save</Button>
                    </Form>
                </Col>
                </>
                
            }
            {
                visualize === old_employee &&
                <Col md={4}>
                    <Form>
                        <Button className="btn-danger" onClick={removeEmployee}>Remove</Button>
                    </Form>
                </Col>
            }
          </Row>
            <JokeGenerator/>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
