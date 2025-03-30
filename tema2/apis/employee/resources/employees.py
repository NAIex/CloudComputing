from resources.resource import Resource

from classes.scheduleJSON import ScheduleJSON

class Employees(Resource):
    def __init__(self, req_handler, command, data):
        super().__init__(req_handler, command, data)

    def __init__(self, req_handler, command, data):
        super().__init__(req_handler,command,data)

    def do_GET(self):    
        if self.path.__len__() > 0:
            employee_id = self.path[0]
            data = self.get_db().select_op(["id","name","role_id"]).from_op("Employees").where_op({"id":employee_id}).execute_and_fetch_op()
            data[0]['schedule'] = ScheduleJSON(f'{data[0]['name'].lower()}').data

        else:
            data = self.get_db().select_op(["id","name","email"]).from_op("Employees").execute_and_fetch_op()      

        message = "Employee data succesfully fetched!"
        self.succes_response(message=message,data={"data":data})
        
    def do_POST(self):
        
        if not self.data["form_data"].__contains__("name") or not self.data["form_data"].__contains__("role_id") or not self.data["form_data"].__contains__("email"):
            self.response(Resource.BAD_REQUEST, "Missing either user name or role_id in order to create it!")
            return

        name     = self.data["form_data"]["name"]
        role_id = self.data["form_data"]["role_id"]
        email = self.data["form_data"]["email"]


        db = self.get_db()
        data = db.select_op(["name"]).from_op("Employees").where_op({"name":name}).execute_and_fetch_op()
        has_role = db.select_op(["id"]).from_op("Roles").where_op({"id":role_id}).execute_and_fetch_op()
        if data.__len__() == 0 and has_role.__len__() != 0:
            db.insert_operation(["name","role_id","email"],[name,role_id,email],"Employees")
            message = "New employee added succesfully!"
            ScheduleJSON(name.lower().replace(' ','/'))

            self.succes_response(message=message)
            
        elif data.__len__() != 0:
            message = "Target role already exists!"
            self.response(Resource.CONFLICT,message=message)
        elif has_role.__len__() == 0:
            message = "Role with target id does not exist!"
            self.response(Resource.BAD_REQUEST,message=message)
            pass

    def do_DELETE(self):

        if self.path.__len__() >= 1:
            employee_id = self.path[0]
            db = self.get_db()
            data = db.select_op(["id"]).from_op("Employees").where_op({"id":employee_id}).execute_and_fetch_op()

            if data.__len__() == 0:
                self.response(Resource.NO_CONTENT, "Employee with target ID does not exist!")
                pass
            else:
                db.delete_from_where_op("Employees",{"id":employee_id}).execute_and_commit_op()
                self.succes_response("Succesfully deleted employee.")
        else:
            self.response(Resource.METHOD_NOT_ALLOWERD, "Cannot delete collection, lol.")

    def do_PUT(self):
        response = {}

        if self.path.__len__() == 1:
            employee_id = int(self.path[0])
            
            schedule = self.data["form_data"]["schedule"]
            
            db = self.get_db()
            data = db.select_op(["name"]).from_op("Employees").where_op({"id":employee_id}).execute_and_fetch_op()

            if data.__len__() == 0:
                self.response(Resource.NO_CONTENT, "Employee with target ID does not exist!")
                pass
            else:
                sched = ScheduleJSON(data[0]['name'].lower())
                sched.data = schedule
                sched.save()
                
                self.succes_response("Succesfully updated employee!")
        else:
            self.not_implemented_response()


    pass