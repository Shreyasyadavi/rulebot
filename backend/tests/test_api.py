"""Integration tests for FastAPI endpoints with updated 55+ intent rule library."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """GET /api/health returns 200 and ok status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "RuleBot"


def test_chat_endpoint_greeting():
    """POST /api/chat with 'hello' returns greeting_hello intent and Greetings category."""
    response = client.post("/api/chat", json={"message": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert data["responseType"] == "rule"
    assert data["intent"] == "greeting_hello"
    assert data["category"] == "Greetings"
    assert data["matchType"] in ["exact", "pattern", "keyword"]
    assert data["confidence"] > 0
    assert data["sessionId"].startswith("RB-")
    assert data["pipelineStep"] == "response_delivery"


def test_chat_endpoint_python():
    """POST /api/chat with 'What is Python?' returns python_definition intent."""
    response = client.post("/api/chat", json={"message": "What is Python?"})
    assert response.status_code == 200
    data = response.json()
    assert data["responseType"] == "rule"
    assert data["intent"] == "python_definition"
    assert data["category"] == "Python"
    assert "Python" in data["response"]


def test_chat_endpoint_ai():
    """POST /api/chat with 'What is AI?' returns ai_definition intent."""
    response = client.post("/api/chat", json={"message": "What is AI?"})
    assert response.status_code == 200
    data = response.json()
    assert data["responseType"] == "rule"
    assert data["intent"] == "ai_definition"
    assert data["category"] == "AI / Machine Learning"


def test_chat_endpoint_unmatched_fallback():
    """POST /api/chat with unknown topic returns fallback."""
    response = client.post("/api/chat", json={"message": "xyz unknown query 123"})
    assert response.status_code == 200
    data = response.json()
    assert data["responseType"] == "fallback"
    assert data["intent"] is None
    assert data["category"] is None
    assert data["matchType"] == "none"
    assert data["confidence"] == 0.0


def test_chat_endpoint_validation_error():
    """POST /api/chat with invalid empty body returns 422 Unprocessable Entity."""
    response = client.post("/api/chat", json={"message": ""})
    assert response.status_code == 422
