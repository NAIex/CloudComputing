from resources.resource import Resource

class Roles(Resource):
    def __init__(self, req_handler, command, data):
        super().__init__(req_handler,command,data)

    def do_GET(self):    
        if self.path.__len__() > 0:
            role_id = self.path[0]

            data = self.get_db().select_op(["id","name","description"]).from_op("Roles").where_op({"id":role_id}).execute_and_fetch_op()

        else:
            data = self.get_db().select_op(["id","name"]).from_op("Roles").execute_and_fetch_op()      

        message = "Role data succesfully fetched!"
        self.succes_response(message=message,data={"data":data})
        
    def do_POST(self):
        
        if not self.data["form_data"].__contains__("name") or not self.data["form_data"].__contains__("description"):
            self.response(Resource.BAD_REQUEST, "Missing either user name or description in order to create it!")
            return

        name     = self.data["form_data"]["name"]
        description = self.data["form_data"]["description"]


        db = self.get_db()
        data = db.select_op(["name"]).from_op("Roles").where_op({"name":name}).execute_and_fetch_op()

        if data.__len__() == 0:
            db.insert_operation(["name","description"],[name,description],"Roles")

            message = "New role added succesfully!"
            self.succes_response(message=message)
        else:
            message = "Target role already exists!"
            self.response(Resource.CONFLICT,message=message)

    def do_DELETE(self):

        if self.path.__len__() >= 1:
            role_id = self.path[0]
            db = self.get_db()
            data = db.select_op(["id"]).from_op("Roles").where_op({"id":role_id}).execute_and_fetch_op()

            if data.__len__() == 0:
                self.response(Resource.NO_CONTENT, "Role with target ID does not exist!")
                pass
            else:
                db.delete_from_where_op("Roles",{"id":role_id}).execute_and_commit_op()
                db.update_op("Employees").set_op({"role_id":"-1"}).where_op({"role_id":role_id}).execute_and_commit_op()
                self.succes_response("Succesfully deleted role.")
        else:
            self.response(Resource.METHOD_NOT_ALLOWERD, "Cannot delete collection, lol.")

    def do_PUT(self):
        response = {}

        if self.path.__len__() == 1:
            role_id = int(self.path[0])
            
            description = self.data["form_data"]["description"]
            
            db = self.get_db()
            data = db.select_op(["id"]).from_op("Roles").where_op({"id":role_id}).execute_and_fetch_op()

            if data.__len__() == 0:
                self.response(Resource.NO_CONTENT, "Role with target ID does not exist!")
                pass
            else:
                db.update_op("Roles").set_op({"description":description}).where_op({"id":role_id}).execute_and_commit_op()
                self.succes_response("Succesfully updated role!")
        else:
            self.not_implemented_response()

