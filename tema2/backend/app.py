import requests

from flask import Flask, request, jsonify, Response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS
import json

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = open('jwt_secret_key.txt').readline()

jwt = JWTManager(app)

CORS(app)

EMAIL_URL = "http://127.0.0.1:5002/"
AUTH_URL = "http://127.0.0.1:5001/"
EMPLOYEE_URL = "http://localhost:8000/"


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        data['jwt_key'] = app.config["JWT_SECRET_KEY"]

        headers = {
            'Content-Type' : 'application/json'
        }

        response = requests.post(AUTH_URL+'login',json=data, headers=headers)
        data = response.json()
        code = response.status_code
        return jsonify(data), code    
    except requests.ConnectionError:
        return jsonify({"message":"Service is down!"}), 500




@app.route("/joke", methods =["GET"])
@jwt_required()
def joke():
    url = "https://v2.jokeapi.dev/joke/Any?safe-mode"
    
    headers = {
        'Content-Type' : 'application/json'
    }
    data = None
    while data == None:
        response = requests.get(url,headers=headers)
        data = response.json()
        

    return jsonify(data), 200

@app.route("/employees",methods=["GET", "POST"])
@jwt_required()
def employees():
    try:
        if request.method == "GET":
            response = requests.get(EMPLOYEE_URL+'employees')
            data = response.json()
            data = data['data']

            return data, 200
        elif request.method == "POST":
            data = request.get_json()
            data["role_id"] = 1
            print(data)
            response = requests.post(EMPLOYEE_URL+'employees',files=data)
            
            return data, 200
    except requests.ConnectionError:
        return jsonify({"message":"Service is down!"}), 500
    


@app.route("/employees/<id>",methods=["GET","PUT","DELETE"])
@jwt_required()
def employee(id):
    if request.method == "GET":
        response = requests.get(EMPLOYEE_URL+f"employees/{id}")
        data = response.json()

        return data, 200
    elif request.method == "PUT":
        data = request.get_json()
        headers = {
        'Content-Type' : 'application/json'
        }
        response = requests.put(EMPLOYEE_URL+f"employees/{id}",json=data,headers=headers)
        data = response.json()
        return data, 200
    elif request.method == "DELETE":
        headers = {
        'Content-Type' : 'application/json'
        }
        response = requests.delete(EMPLOYEE_URL+f"employees/{id}",headers=headers)
        data = response.json()
        return data, 200


@app.route("/email", methods=["POST"])
@jwt_required()
def email():    
    data = {}

    # Getting all the not NULL emails
    response = requests.get(EMPLOYEE_URL+'employees')
    
    employee_data = response.json()['data']

    emails = list(filter(lambda x: x[1] != None,[(employee['name'].lower(),employee['email'],employee['id']) for employee in employee_data]))
    
    days  = ['monday','tuesday','wendsday', 'thursday','friday','saturday','sunday']

    for name, email, id in emails:
        response = requests.get(EMPLOYEE_URL+f"employees/{id}")
        data = response.json()['data'][0]
        schedule = data['schedule']

        program = ""
        for day in days:
            first_interval = schedule[day]['0']
            second_interval = schedule[day]['1']

            program += f'{day.capitalize()}: '
            program += 'You will work in ' if (first_interval or second_interval) else 'You will be free.'
            program += 'the first interval ' if first_interval else ''
            program += 'and the second interval.' if (second_interval and first_interval) else ''
            program += 'the second interval.' if (second_interval and not first_interval) else ''
            
            program += '\n'

        data['to'] = email
        data["subject"] = f"Genering Company Name | Your schedule for the next week"
        data["message"] = \
        f'Dear {str.capitalize(name)},\n\n' + \
        'Your schedule for the next week is the following:\n\n' + program

        try:
            response = requests.post(EMAIL_URL+'send-email',json=data)        
        except requests.ConnectionError:
            return jsonify({"message":"Service is down."}) , 500
        

    return jsonify({"message":"ok"}), 200



if __name__== "__main__":
    app.run(debug=True)

