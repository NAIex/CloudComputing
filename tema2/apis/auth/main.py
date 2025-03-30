from flask import Flask, request, jsonify, Response
from flask_jwt_extended import create_access_token, JWTManager
from flask_cors import CORS



import _sqlite3

app = Flask(__name__)

CORS(app)
jwt = JWTManager(app)


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    jwt_key = data.get("jwt_key")

    app.config["JWT_SECRET_KEY"] = jwt_key

    con = _sqlite3.connect('data.db')
    cur = con.cursor()

    res = cur.execute('SELECT password FROM Users WHERE email = (?)', [(email)])
    data = res.fetchall()
    correct_pass = data[0][0] if data.__len__()  == 1 else None
    if correct_pass == password:
        access_token = create_access_token(identity=email)
        
        return jsonify({"Response":"Login succesful!", "token":access_token}), 200
    else:
        return jsonify({"Response": "Invalid credentials!"}), 406 



if __name__ == "__main__":
    app.run(debug=True, port=5001)