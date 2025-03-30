import React, { useState } from "react";

import { ListGroup, ListGroupItem } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css'

interface Props{
    employees: [{id: number, name:string}],
    onSelect : ({}) => void
}

const EmployeeList = ({employees,onSelect}:Props) => {
    
    const [selectedID, setSelectedID] = useState(-2)

    return (
        <ListGroup>
            <div className="text-center">Employees</div>
            {employees.map((e, index) => (
                <ListGroupItem
                key={e.id}
                className={`p-2 ${selectedID == e.id && 'active'}`}
                onClick={() => {
                    onSelect(e); setSelectedID(e.id)}}
                >
                {e.name}
                </ListGroupItem>
            ))}
        </ListGroup>
    )
}

export default EmployeeList