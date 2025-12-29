# KC-Ticket-To-Ride

A web-based version of the Ticket to Ride board game, set in Kansas City. Play with friends, claim routes, and compete for the highest score!

## Features

- 🎲 Supports 2-5 players
- 🗺️ Interactive Kansas City map with clickable routes
- 🚂 Train cards and route claiming mechanics
- 🏆 Score tracking and game-over screen
- 💾 Persistent game state using SQLite
- 🔄 Real-time updates with Flask backend and JavaScript frontend
- 📝 Destination tickets per player (Currently being worked on)
- 🃏 Draw train cards
- 🖥️ Responsive UI for desktop browsers

## Getting Started

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/KC-Ticket-To-Ride.git
   cd KC-Ticket-To-Ride
   ```

2. Install dependencies:
   ```bash
   pip install flask
   ```

3. Run the server:
   ```bash
   python src/main.py
   ```

4. Open your browser and go to [http://localhost:5000](http://localhost:5000)

## Usage

- Set the number of players (2-5) on the start screen.
- Each player takes turns drawing cards or claiming routes.
- Complete destination tickets for bonus points.
- The game ends when a player has 2 or fewer trains left.
- View final scores on the game-over screen.

## Project Structure

```
src/
  main.py
  database/
    database.py
    data.sqlite3
  static/
    js/
      game.js
      player.js
      graphStruct.js
    css/
      styles.css
  templates/
    index.html
    playerCount.html
    about.html
    final.html
tests/
  test_database.py
  test_sending_data.py
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

- Game design inspired by Ticket to Ride by Alan R. Moon
- Map and graph logic based on [GeeksforGeeks Graph Implementation](https://www.geeksforgeeks.org/javascript/implementation-graph-javascript/)
