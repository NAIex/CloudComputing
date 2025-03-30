import requests

from flask import Flask, request, jsonify, Response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS
import json

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = open('jwt_secret_key.txt').readline()

jwt = JWTManager(app)

CORS(app)


@app.route("/login", methods=["POST"])
def login():
    url = "http://127.0.0.1:5001/login"

    data = request.get_json()
    data['jwt_key'] = app.config["JWT_SECRET_KEY"]

    headers = {
        'Content-Type' : 'application/json'
    }

    response = requests.post(url,json=data, headers=headers)
    data = response.json()
    code = response.status_code

    return jsonify(data), code    

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
    if request.method == "GET":
        response = requests.get('http://localhost:8000/employees')
        data = response.json()
        data = data['data']

        return data, 200
    elif request.method == "POST":
        data = request.get_json()
        data["role_id"] = 1
        print(data)
        response = requests.post('http://localhost:8000/employees',files=data)
        
        return data, 200
    


@app.route("/employees/<id>",methods=["GET","PUT"])
@jwt_required()
def employee(id):
    if request.method == "GET":
        response = requests.get(f"http://localhost:8000/employees/{id}")
        data = response.json()

        return data, 200
    elif request.method == "PUT":
        data = request.get_json()
        headers = {
        'Content-Type' : 'application/json'
        }
        response = requests.put(f"http://localhost:8000/employees/{id}",json=data,headers=headers)
        data = response.json()

        return data, 200

@app.route("/email", methods=["POST"])
@jwt_required()
def email():
    url = "http://127.0.0.1:5002/send-email"

    data = {}

    data["to"] = "alexneagubiz@gmail.com"
    data["subject"] = "Hello"
    data["message"] = "I am virus."


    if request.method == "POST":
        response = requests.post(url,json=data)
        print(response.json())
        return jsonify({"message":response.json()})
        
    pass


if __name__== "__main__":
    app.run(debug=True)

