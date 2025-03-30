from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse

from resources.users import Users
from resources.roles import Roles
from resources.schedules import Schedules
from resources.employees import Employees
from utils.functions import *
import urllib
import sqlite3
import os
import json
import re

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def logic(self):
        s, params = split_path_and_params(self.path)
        print(f'Request path: {s}')
        print(f'Request params: {params}')
        print(f'Request command: {self.command}')
        print(f'Request headers: {self.headers}')
        #print(f'Request body: {}')


        resource_name = s[0]

        has_resource = globals().__contains__(resource_name.capitalize())

        data = {}
        data['path'] = s[1:]
        if self.command in {"POST", "PUT"}:
            length = int(self.headers.get('Content-Length'))
            raw_data = self.rfile.read(length).decode('utf-8')
            print(f'Raw data: {raw_data}')
            form_data = re.findall('name=\"([\\w]+)\"[\\s]+([^\\r]+)',raw_data)
            print(f"Filtered data:{form_data}")
            form_data = {pair[0] : pair[1]for pair in form_data}
            if self.headers.get('Content-Type') == 'application/json':
                data["form_data"] = json.decoder.JSONDecoder().decode(raw_data)
                pass
            else:
                data["form_data"] = form_data
                

        if has_resource:
            c = globals()[resource_name.capitalize()](self,self.command, data)
        else:
            self.send_response(404)
            self.end_headers()

        pass
    def do_GET(self)    : self.logic()
    def do_POST(self)   : self.logic()
    def do_PUT(self)    : self.logic()
    def do_DELETE(self) : self.logic()


if __name__ == "__main__":

    server = HTTPServer(('localhost',8000),SimpleHTTPRequestHandler)
    print('REST Service running on http://localhost:8000')

    db_name = "data.db"

    exists_db = os.path.exists(db_name)

    if exists_db:
        pass
    else:
        c = sqlite3.connect(db_name)

        cur = c.cursor()
        cur.execute('CREATE TABLE Users(id INTEGER PRIMARY KEY, name TEXT, password TEXT, is_admin TEXT DEFAULT "0");')

        cur.execute('CREATE TABLE Employees(id INTEGER PRIMARY KEY, name TEXT, role_id INTEGER);')
        cur.execute('CREATE TABLE Roles(id INTEGER PRIMARY KEY, name TEXT, description TEXT);')

        cur.execute('CREATE TABLE Schedules(id INTEGER PRIMARY KEY, name TEXT, local_url TEXT);')

        cur.close()

    server.serve_forever()    

    pass