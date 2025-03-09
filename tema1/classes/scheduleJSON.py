import json
import os
class ScheduleJSON:
    def __init__(self, file_name):

        schedule_path = f"./schedules/{file_name}.json"

        if os.path.exists(schedule_path):
            with open(schedule_path, "r") as f:
                self.data = json.decoder.JSONDecoder().decode(f.read())
                print(self.data)
            pass
        else:
            i = {}
            i["interval_1"] = {}
            i["interval_2"] = {}
            self.data = {}

            for s in {"monday","tuesday","wendsday","thursday","friday","saturday","sunday"}:
                self.data[s] = i
            
            with open(schedule_path,'w') as f:
                json.dump(self.data,f)
                pass
            
    pass