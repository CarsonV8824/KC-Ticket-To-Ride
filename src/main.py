from flask import Flask, render_template, request, jsonify
from database.database import Database

#--- Database Interaction Functions ---

def add_data_to_db(player_data, map_data, open_pile):
    db = Database()
    db.add_data(player_data, map_data, open_pile)

def get_data_from_db():
    db = Database()
    return db.get_data()

#--- Flask Application ---

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("playerCount.html")

@app.route("/gamepage")
def gamepage():
    return render_template("index.html")

@app.route("/get_data_from_py", methods=["GET"])
def get_game_data():
    data = get_data_from_db()
    game_data = []
    for player_data, map_data, open_pile in data:
        game_data.append({
            "player_data": player_data,
            "map_data": map_data,
            "open_pile": open_pile
        })
    return jsonify(game_data)

@app.route("/get_data_from_js", methods=["POST"])
def post_game_data():
    data = request.get_json()
    player_data = data.get("player_data")
    map_data = data.get("map_data")
    open_pile = data.get("open_pile")
    
    add_data_to_db(player_data, map_data, open_pile)
    return jsonify({"status": "success", "message": "Game data received."})

if __name__ == "__main__":
    app.run(debug=True)