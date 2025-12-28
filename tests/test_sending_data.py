import pytest

from src.main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_game_data_no_data(client):
    response = client.get('/get_data_from_py')
    assert response.status_code == 404
    assert response.get_json() == {"error": "No game data found"}

if __name__ == "__main__":
    pytest.main()