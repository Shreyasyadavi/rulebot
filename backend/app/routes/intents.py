"""Intents API routes providing metadata and inspection of the rule library."""

from typing import List, Dict, Any
from fastapi import APIRouter, status
from ..chatbot.rules import ALL_RULES

router = APIRouter(tags=["Intents"])


@router.get(
    "/intents",
    response_model=List[Dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Get full catalog of predefined intent rules"
)
async def get_all_intents() -> List[Dict[str, Any]]:
    """Returns the complete list of deterministic intent rules configured in RuleBot."""
    catalog = []
    for r in ALL_RULES:
        catalog.append({
            "name": r.intent,
            "intent": r.intent,
            "category": r.category,
            "exact_phrases": r.exact_phrases,
            "keywords": r.keywords,
            "patterns": r.patterns,
            "response": r.responses[0] if r.responses else "",
            "responses": r.responses,
            "priority": r.priority,
            "status": "Active",
            "matchType": "Exact / Regex / Keyword",
            "responseType": "rule"
        })
    return catalog

