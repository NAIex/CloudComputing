from resources.resource import Resource

from classes.scheduleJSON import ScheduleJSON

class Schedules(Resource):
    def __init__(self, req_handler, command, data):
        super().__init__(req_handler, command, data)

    def do_GET(self):    
        if self.path.__len__() > 0:
            schedule_id = self.path[0]

            data = self.get_db().select_op(["id","name","local_url"]).from_op("Schedules").where_op({"id":schedule_id}).execute_and_fetch_op()

            if data.__len__() != 0:
                data = ScheduleJSON(data[0]["local_url"]).data

                if self.path.__len__() > 1:
                    day = self.path[1]
                    if data.__contains__(day):
                        data = data[day]
                    else:
                        self.response(Resource.BAD_REQUEST,f"Day {day} does not exist!")
                        return
            else:
                self.response(Resource.NO_CONTENT, f"Schedule with id {schedule_id} does not exist!")
                return

        else:
            data = self.get_db().select_op(["id","name"]).from_op("Schedules").execute_and_fetch_op()      

        message = "Schedule data succesfully fetched!"
        self.succes_response(message=message,data={"data":data})
    
    def do_POST(self):
        
        if not self.data["form_data"].__contains__("name"):
            self.response(Resource.BAD_REQUEST, "Missing schedule name!")
            return

        name     = self.data["form_data"]["name"]

        db = self.get_db()
        data = db.select_op(["name"]).from_op("Roles").where_op({"name":name}).execute_and_fetch_op()

        if data.__len__() == 0:
            file_name = f'{str(name).lower().replace(' ','_')}'
            db.insert_operation(["name","local_url"],[name,file_name],"Schedules")

            ScheduleJSON(file_name)


            message = "New schedule added succesfully!"
            self.succes_response(message=message)
        else:
            message = "Target schedule already exists!"
            self.response(Resource.FORBIDDEN,message=message)

    pass