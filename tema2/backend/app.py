import requests

from flask import Flask, request, jsonify, Response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from flask_cors import CORS

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "apwodkp1ok2d9109d"

jwt = JWTManager(app)

CORS(app)

USERS = {"testuser":"password123"}
'''
@app.before_request
def basic_authentication():

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    }

    if request.method.lower() == 'options':
        return Response(headers=headers)
    else:
        return Response()
'''

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if USERS.get(username) == password:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    
    return jsonify({"error":"Invalid credentials"}), 401

@app.route("/protected",methods=["GET"])
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify({"message":f"Welcome {user}"})

@app.route("/employees",methods=["GET" , "POST"])
def employees():
    url = "http://localhost:8000/employees"

    if request.method == "GET":
        response = requests.get(url)
        data = response.json()
        return jsonify(data)
    elif request.method == "POST":
        data = request.get_json()
        print(data)
        response = requests.post(url,data=data)
        data = response.json()

        return jsonify(data)




if __name__== "__main__":
    app.run(debug=True)

