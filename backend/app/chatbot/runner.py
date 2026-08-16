"""CLI runner for RuleBot Python Engine.

Accepts user input as arguments or stdin JSON and outputs the standardized ChatResponse JSON.
"""

import sys
import os
import json
import uuid

# Ensure backend root is always on sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.chatbot.engine import RuleEngine
from app.chatbot.fallback import get_fallback_response

def main():
    engine = RuleEngine()
    if len(sys.argv) > 1:
        message = sys.argv[1]
        session_id = sys.argv[2] if len(sys.argv) > 2 else f"RB-{uuid.uuid4().hex[:8].upper()}"
    else:
        try:
            payload = json.loads(sys.stdin.read())
            message = payload.get("message", "")
            session_id = payload.get("sessionId") or f"RB-{uuid.uuid4().hex[:8].upper()}"
        except Exception:
            message = ""
            session_id = f"RB-{uuid.uuid4().hex[:8].upper()}"

    # 1. First run deterministic rule engine
    result = engine.match(message)

    if result.response_type == "rule":
        output = {
            "response": result.response,
            "responseType": "rule",
            "intent": result.intent,
            "category": result.category,
            "matchType": result.match_type,
            "confidence": result.confidence,
            "sessionId": session_id,
            "pipelineStep": "response_delivery"
        }
    else:
        # 2. No rule matched -> Controlled Local Fallback
        fallback_text = get_fallback_response(message)
        output = {
            "response": fallback_text,
            "responseType": "fallback",
            "intent": None,
            "category": None,
            "matchType": "none",
            "confidence": 0.0,
            "sessionId": session_id,
            "pipelineStep": "response_delivery"
        }

    print(json.dumps(output))


if __name__ == "__main__":
    main()

