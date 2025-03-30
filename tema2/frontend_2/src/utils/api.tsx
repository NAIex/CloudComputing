const API_URL = "http://127.0.0.1:5000";

export async function fetchEmployees(token : string) {
    const response = await fetch(`${API_URL}/employees`, {
        method:"GET",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    const data: [{}] = await response.json();
    data.push({id:-1, name:"Add new employee"});
    return data;
}

export async function fetchEmployeeData(id:string,token : string) {
    const response = await fetch(`${API_URL}/employees/${id}`, {
        method:"GET",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    const data = await response.json();
    return data?.data[0]?.schedule??{};
}


export async function updateEmployeeSchedule(id:string, schedule : {},token : string) {
    return fetch(`${API_URL}/employees/${id}`, {
        method:"PUT",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token}`
        },
        body:JSON.stringify({schedule})
    });

}

export async function createEmployee(name:string, email:string, token:string) {
    return fetch(`${API_URL}/employees`, {
        method:"POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token}`
        },
        body:JSON.stringify({name, email})
    });
}
export async function deleteEmployee(id:string,token : string) {
    return fetch(`${API_URL}/employees/${id}`, {
        method:"DELETE",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

}

export async function sendEmail(token:string) {
    return fetch(`${API_URL}/email`, {
        method:"POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
}
