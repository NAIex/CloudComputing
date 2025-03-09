import sqlite3

class Database:
    def __init__(self):
        self.conn = sqlite3.connect("data.db")
        self.op = ""
        self.res = None
    def __del__(self):
        self.conn.close()

    
    def dict_to_string(self, d:dict):
        key_val = [str(key)+"="+("\""+val+"\"" if isinstance(val,str) else str(val)) for key, val in d.items()]
        return key_val

    def select_op(self, columns_list: list[str]):
        self.op += f'SELECT {",".join(columns_list)} ' 
        
        return self
    
    def from_op(self, table_name):
        self.op += f'FROM {table_name} '

        return self
    def update_op(self, table_name):
        self.op += f'UPDATE {table_name} '
        return self
    
    def set_op(self, dict):
        self.op += "SET " + ", ".join(self.dict_to_string(dict)) + " "
        return self
    
    def where_op(self, where: dict):
        key_val = self.dict_to_string(where)
        self.op += f'WHERE {" and ".join(key_val)}'

        return self
    
    def delete_from_where_op(self, table_name, where:dict):
        self.op += f'DELETE FROM {table_name} '

        return self.where_op(where)


    def execute_and_fetch_op(self):
        self.op += ';'
        print(self.op)

        res = self.conn.execute(self.op)

        lines = res.fetchall()
        columns_list = list(map(lambda x: x[0], res.description))

        data = [{columns_list[i]:column for i, column in enumerate(line)} for line in lines]
        
        self.op = ""
        return data
    
    def execute_and_commit_op(self):
        self.op += ';'
        print(self.op)

        self.conn.execute(self.op)
        self.conn.commit()

        self.op = ""

    def select_operation(self, columns_list: list[str], table_name:str):
        res = self.conn.execute(f'SELECT {",".join(columns_list)} from {table_name};')
        lines = res.fetchall()

        data = [{columns_list[i]:column for i, column in enumerate(line)} for line in lines]

        return data
    


    def insert_operation(self, columns_list : list[str], values: list[str], table_name:str):
        values = ['\"'+val+'\"' for val in values]

        self.conn.execute(f'INSERT INTO {table_name}({",".join(columns_list)}) VALUES({",".join(values)})')
        self.conn.commit()

    pass