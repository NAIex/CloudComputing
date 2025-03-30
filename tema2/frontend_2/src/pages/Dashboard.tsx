import React, { useEffect, useState } from 'react'
import { Button, Col, Container, FormControl, InputGroup, ListGroup, ListGroupItem, Navbar, Row, Stack } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import JokeGenerator from '../components/JokeGenerator'

const Dashboard = () => {
    var token = localStorage.getItem('token');
    async function fetchEmployees(){
        let response = await fetch('http://127.0.0.1:5000/employees',{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })

        let data = await response.json()
        data.push({"id":-1,"name":'Add new employee'})


        setEmployees(data)
    }
    async function createNewEmployee(){
        let response = await fetch('http://127.0.0.1:5000/employees',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body: JSON.stringify({"name":chosenEmployee})
        })
        let data = await response.json()
        fetchEmployees()
    }
    async function updateEmployeeData(id:number){
        let response = await fetch(`http://127.0.0.1:5000/employees/${id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body: JSON.stringify({"schedule":chosenSchedule})
        })
    }

    async function fetchEmployeeData(id:number){
        let response = await fetch(`http://127.0.0.1:5000/employees/${id}`,{
            method: "GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
        })

        let data = await response.json()
        setChosenSchedule(data['data'][0]['schedule'])

    } 
    async function sendEmail(){
        let response = await fetch("http://127.0.0.1:5000/email",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
        })

    }

    useEffect(() => {
        fetchEmployees()
    }, [])


    /*let employees = [
        'John',
        'Pork'
    ]*/
    const [employees, setEmployees] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState(-1)
    
    const [chosenEmployee, setChosenEmployee] = useState('')
    const [chosenEmployeeId, setChosenEmployeeID] = useState(-1)
    const viewingEmployee = chosenEmployee !== ''
    const schedule = {
        monday:{'0':false,'1':false},
        tuesday:{'0':false,'1':false},
        wendsday:{'0':false,'1':false},
        thursday:{'0':false,'1':false},
        friday:{'0':false,'1':false},
        saturday:{'0':false,'1':false},
        sunday:{'0':false,'1':false},
    }
    const [chosenSchedule, setChosenSchedule] = useState(schedule)

    const [isAdding, setIsAdding] = useState(false)

    function displayData(d:number, name:string ,id:number){
        fetchEmployeeData(id)
        
        setSelectedEmployee(d)
        setChosenEmployee(name)
        setChosenEmployeeID(id)
        setIsAdding(false)
    }
    function addNewData(d: number){
        setSelectedEmployee(d)
        setIsAdding(true)
    }

    function updateSchedule(day:string, interval:string){
        let copy = {}
        Object.assign(copy,chosenSchedule)

        copy[day][interval] = !copy[day][interval]

        setChosenSchedule(copy)
        console.log(day,interval)
    }

    let days = [
        'monday',
        'tuesday',
        'wendsday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ]


  return (
    <Container className="vh-100 vw-100 m-0">
        <Row className='vh-100'>
            <Col md="2" className='bg-info pt-5 px-2'>
                <ListGroup>
                    <div className='text-center'>Employees</div>
                    {employees.map(
                        (e,index)=> 
                        <ListGroupItem key={e.id}  
                        className={`p-2 ${selectedEmployee == index ? "active": ""}`}
                        onClick={(event) => 
                            index == employees.length-1
                            ? addNewData(index)
                            :displayData(index,event.currentTarget.innerHTML, e.id)}>{e.name}</ListGroupItem>
                        )}                          
                </ListGroup>
                <Button className='mt-5'>Generate Schedule</Button>
            </Col>
            <Col md="10">
                <Navbar>
                    <h1>Dashboard</h1>
                </Navbar>
                {viewingEmployee && 
                <Container>
                    <Row className='md-2'>
                        <Col md="6">
                            {isAdding ?<FormControl onChange={(event) => setChosenEmployee(event.target.value)} className='mt-2 pt-2' type='text' placeholder='name'></FormControl>  : <h3 className='mt-2 pt-2'>{chosenEmployee}</h3>}
                        </Col>
                        <Container className={isAdding ? "invisible pe-none" : ""}>
                            <Row className='text-center mb-3'>
                                    <Col sm={2}>Day</Col>
                                    <Col sm={2}>Interval 1</Col>
                                    <Col sm={2}>Interval 2</Col>
                            </Row>
                            {days.map((name,index) =>(
                                <Row className='text-center mb-1'>
                                    <Col sm={2}>{name}</Col>
                                    <Col onClick={() => updateSchedule(name,'0')}
                                     key={`${index}0`}
                                     className={`mx-1 btn btn-${chosenSchedule[name]['0'] === true ? "success" : "danger"}`}
                                     sm={2}
                                     >{chosenSchedule[name]['0'] === true ? 'Available' : '-'}</Col>
                                    <Col sm={2}
                                     onClick={() => updateSchedule(name,'1')}
                                     key={`${index}1`}
                                     className={` btn btn-${chosenSchedule[name]['1'] === true ? "success" : "danger"}`}
                                     >{chosenSchedule[name]['1'] === true ? 'Available' : '-'}</Col>
                                </Row>)
                            )}
                        </Container>
                    </Row>
                    <Row className='md-4 pt-5'>
                        <Col md="2">
                            <Button variant='success' onClick={isAdding ? createNewEmployee : () => updateEmployeeData(chosenEmployeeId)}>Save Data</Button>
                        </Col>
                        <Col md="3">
                            {!isAdding && <Button variant='danger'>Remove Employee</Button>}
                        </Col>
                    </Row>
                </Container>}
                <Row className='mt-5'>
                    <Col md="2">
                        <Button onClick={sendEmail}>Send e-mail</Button>
                    </Col>
                </Row>
                <Row className='position-absolute  bottom-0'>
                    <JokeGenerator/>
                </Row>
            </Col>
            
        </Row>
    </Container>
  )
}

export default Dashboard
