import json
import os
class ScheduleJSON:
    def __init__(self, file_name):

        self.schedule_path = f"./schedules/{file_name}.json"

        if os.path.exists(self.schedule_path):
            with open(self.schedule_path, "r") as f:
                self.data = json.decoder.JSONDecoder().decode(f.read())
                print(self.data)
            pass
        else:
            i = {}
            i[0] = False
            i[1] = False
            self.data = {}

            for s in {"monday","tuesday","wendsday","thursday","friday","saturday","sunday"}:
                self.data[s] = i
            
            with open(self.schedule_path,'w') as f:
                json.dump(self.data,f)
                pass
    def save(self):
        with open(self.schedule_path, "w") as f:
                #self.data = json.decoder.JSONDecoder().decode(f.read())
                json.dump(self.data,f)
    pass