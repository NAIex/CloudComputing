from resources.resource import Resource

import sqlite3
import json

class Users(Resource):
    def __init__(self, req_handler,command,data):
        super().__init__(req_handler,command,data)

    def do_GET(self):
            
        if self.path.__len__() > 0:
            user_id = self.path[0]

            data = self.get_db().select_op(["id","name","password"]).from_op("Users").where_op({"id":user_id}).execute_and_fetch_op()

        else:
            data = self.get_db().select_op(["id","name"]).from_op("Users").execute_and_fetch_op()

            

        message = "User data succesfully fetched!"
        self.succes_response(message=message,data={"data":data})

    def do_POST(self):

        if not self.data["form_data"].__contains__("name") or not self.data["form_data"].__contains__("password"):
            self.response(Resource.BAD_REQUEST, "Missing either user name or passwor in order to create it!")
            return

        name     = self.data["form_data"]["name"]
        password = self.data["form_data"]["password"]


        db = self.get_db()
        data = db.select_op(["name"]).from_op("Users").where_op({"name":name}).execute_and_fetch_op()

        if data.__len__() == 0:
            db.insert_operation(["name","password"],[name,password],"Users")

            message = "New user added succesfully!"
            self.succes_response(message=message)
        else:
            message = "Target user already exists!"
            self.response(Resource.FORBIDDEN,message=message)         

    def do_DELETE(self):

        if self.path.__len__() >= 1:
            user_id = self.path[0]
            db = self.get_db()
            data = db.select_op(["id"]).from_op("Users").where_op({"id":user_id}).execute_and_fetch_op()

            if data.__len__() == 0:
                self.response(Resource.NO_CONTENT, "User with target ID does not exist!")
                pass
            else:
                db.delete_from_where_op("Users",{"id":user_id}).execute_and_commit_op()
                self.succes_response("Succesfully deleted user.")
        else:
            self.response(Resource.FORBIDDEN, "Cannot delete collection, lol.")

    def do_PUT(self):
        response = {}

        if self.path.__len__() == 1:
            user_id = int(self.path[0])
            
            if not self.data["form_data"].__contains__("password"):
                self.response(Resource.BAD_REQUEST, "Cant set new password if old password is missing!")
                return

            password = self.data["form_data"]["password"]
            
            db = self.get_db()
            data = db.select_op(["id"]).from_op("Users").where_op({"id":user_id}).execute_and_fetch_op()

            if data.__len__() == 0:
                self.response(Resource.NO_CONTENT, "User with target ID does not exist!")
                pass
            else:
                db.update_op("Users").set_op({"password":password}).where_op({"id":user_id}).execute_and_commit_op()
                self.succes_response("Succesfully updated user!")
        else:
            self.not_implemented_response()


            
        

    




    