import sqlite3
import json

class Database:
    
    def __init__(self, name="src/database/data.sqlite3"):
        self.connection = sqlite3.connect(name)
        self.cursor = self.connection.cursor()
        self.__make_table()

    def __make_table(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS TicketToRide (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                PlayerData TEXT,
                MapData TEXT
            );
        """)
        self.connection.commit()

    def add_data(self, player_data: dict, map_data: dict):
        self.cursor.execute("""
        INSERT INTO TicketToRide (PlayerData, MapData) VALUES (?, ?)
        """, (json.dumps(player_data), json.dumps(map_data)))
        self.connection.commit()
    
    def get_data(self) -> list[tuple[dict, dict]]:
        try:
            data = self.cursor.execute("""SELECT PlayerData, MapData FROM TicketToRide""")
            new_loaded_data = []
            for row in data.fetchall():
                player_data = json.loads(row[0])  
                map_data = json.loads(row[1])     
                new_loaded_data.append((player_data, map_data))
            return new_loaded_data
        except Exception as e:
            print(f"Error retrieving data: {e}")
            return []
    
    def __del__(self):
        self.connection.close()