import pytest

from src.database import database
from src.main import app, add_data_to_db, get_data_from_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client