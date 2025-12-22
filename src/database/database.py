import sqlite3
import json

class Database:
    
    def __init__(self, name="src/database/KCTicketToRide.sqlite"):
        self.connection = sqlite3.connect(name)
        self.cursor = self.connection.cursor()
        self.__make_table()

    def __make_table(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS TicketToRide (
                PlayerData TEXT                   
            );
        """)
        self.connection.commit()

    def add_data(self, player_data):
        self.cursor.execute("""
        INSERT INOT TicketToRide PlayerData (?)
        """), (json.dumps(player_data))
        self.connection.commit()
    
    def get_data(self):
        data = self.cursor.execute("""SELECT * FROM TicketToRide""")
        self.connection.commit()
        return data
    
    def close(self):
        self.connection.close()