from flask import Flask, render_template, request, jsonify
from database.database import Database
import json

#--- Database Interaction Functions ---

def add_data_to_db(player_data, map_data, open_pile):
    db = Database()
    db.add_data(player_data, map_data, open_pile)

def get_data_from_db():
    db = Database()
    return db.get_data()

def update_data_in_db(player_data, map_data, open_pile):
    db = Database()
    db.update_data(player_data, map_data, open_pile)

#--- Flask Application ---

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("playerCount.html")

@app.route("/reset_game", methods=["POST"])
def reset_game():
    try:
        db = Database()
        db.cursor.execute("DELETE FROM TicketToRide")
        db.connection.commit()
        db.connection.close()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/initialize_game", methods=["POST"])
def initialize_game():
    try:
        data = request.get_json()
        player_count = data.get("player_count")
        
        # Create initial game data
        player_data = [{"color": ["blue", "red", "green", "yellow", "black"][i], "cards": []} for i in range(player_count)]
        map_data = []
        open_pile = []
        
        add_data_to_db(player_data, map_data, open_pile)
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/gamepage")
def gamepage():
    return render_template("index.html")

@app.route("/get_data_from_py", methods=["GET"])
def get_game_data():
    try:
        data = get_data_from_db()
        if data:
            player_data, map_data, open_pile = data[0]
            return jsonify({
                "player_data": player_data,
                "map_data": map_data,
                "open_pile": open_pile
            })
        return jsonify({"error": "No game data found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/get_data_from_js", methods=["POST"])
def post_game_data():
    data = request.get_json()
    player_data = data.get("player_data")
    map_data = data.get("map_data")
    open_pile = data.get("open_pile")
    
    with open("src/database/test_database.txt", "a") as f:
        f.write(str(data) + "\n")
    
    # Update the last row instead of inserting a new one
    try:
        db = Database()
        db.cursor.execute("""
            DELETE FROM TicketToRide WHERE id != (SELECT MAX(id) FROM TicketToRide)
        """)
        db.cursor.execute("""
            UPDATE TicketToRide SET PlayerData = ?, MapData = ?, OpenPile = ? WHERE id = (SELECT MAX(id) FROM TicketToRide)
        """, (json.dumps(player_data), json.dumps(map_data), json.dumps(open_pile)))
        db.connection.commit()
        db.connection.close()
        return jsonify({"status": "success", "message": "Game data updated."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)