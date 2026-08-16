import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)


def test_vercel_health_route():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_vercel_chat_route_with_hello():
    response = client.post("/api/chat", json={"message": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "greeting_hello"
    assert data["responseType"] == "rule"


def test_vercel_fallback_route():
    response = client.post("/api/chat", json={"message": "xyz unknown query 123"})
    assert response.status_code == 200
    data = response.json()
    assert data["responseType"] == "fallback"
    assert data["intent"] is None
