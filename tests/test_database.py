from src.database import database
import pytest

def test_add_data():
    db = database.Database(":memory:")  # Use in-memory database for testing
    player_data = {"name": "Alice", "score": 10}
    map_data = {"map_name": "USA", "routes": []}
    
    db.add_data(player_data, map_data)
    
    retrieved_data = db.get_data()
    assert len(retrieved_data) == 1
    assert retrieved_data[0][0] == player_data
    assert retrieved_data[0][1] == map_data

def test_get_data_empty():
    db = database.Database(":memory:")  # Use in-memory database for testing
    retrieved_data = db.get_data()
    assert retrieved_data == []

def test_multiple_entries():
    db = database.Database(":memory:")  # Use in-memory database for testing
    entries = [
        ({"name": "Alice", "score": 10}, {"map_name": "USA", "routes": []}),
        ({"name": "Bob", "score": 15}, {"map_name": "Europe", "routes": []}),
        ({"name": "Charlie", "score": 20}, {"map_name": "Asia", "routes": []}),
    ]
    
    for player_data, map_data in entries:
        db.add_data(player_data, map_data)
    
    retrieved_data = db.get_data()
    assert len(retrieved_data) == len(entries)
    for i in range(len(entries)):
        assert retrieved_data[i][0] == entries[i][0]
        assert retrieved_data[i][1] == entries[i][1]

if __name__ == "__main__":
    pytest.main()