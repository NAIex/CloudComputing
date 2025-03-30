from http.server import BaseHTTPRequestHandler
from utils.database import Database
import sqlite3
import json

class Resource:

    OK = 200
    CREATED = 201
    NO_CONTENT = 204

    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    METHOD_NOT_ALLOWERD = 405
    CONFLICT = 409


    def __init__(self, req_handler : BaseHTTPRequestHandler, command,data):
        self.handler = req_handler
        self.command = command
        self.data    = data

        self.path:list = data["path"]

        getattr(self,f'do_{command}')()

        pass

    def get_db(self) -> Database:
        return Database()

    def response(self, response_code, message = None, data : dict = None):
        response = {} if data == None else data
        response["message"] = "Request processed succesfully" if message == None else message

        self.handler.send_response(response_code) 
        self.handler.send_header("Content-Type", "application/json")
        self.handler.end_headers()
        self.handler.wfile.write(json.dumps(response).encode("utf-8"))

    def succes_response(self, message = None, data : dict = None): self.response(200,message,data)
    def not_implemented_response(self): self.response(403,"Command not implemented for endpoint")

    def do_GET(self):
        self.not_implemented_response()
        
    def do_POST(self):
        self.not_implemented_response()

    def do_DELETE(self):
        self.not_implemented_response()

    def do_PUT(self):
        self.not_implemented_response()

    pass