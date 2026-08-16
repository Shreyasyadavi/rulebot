"""Chat API routes handling conversational turns, rule engine dispatching, and controlled local fallback."""

import uuid
from fastapi import APIRouter, HTTPException, status
from ..schemas import ChatRequest, ChatResponse
from ..chatbot.engine import RuleEngine
from ..chatbot.fallback import get_fallback_response

router = APIRouter(tags=["Chat"])

# Instantiate single global rule engine instance
engine = RuleEngine()


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Process user message through Rule Engine with controlled fallback"
)
async def handle_chat_message(request: ChatRequest) -> ChatResponse:
    """Processes a user input message against deterministic rules first.
    
    If no rule matches, returns a controlled local fallback response.
    Returns structured JSON with response text, intent classification,
    confidence score, match type, and session tracking ID.
    """
    try:
        user_message = request.message
        session_id = request.sessionId or f"RB-{uuid.uuid4().hex[:8].upper()}"

        # 1. Execute rule matching FIRST (Deterministic Rule Engine)
        result = engine.match(user_message)

        # 2. If a rule matched, return deterministic response immediately
        if result.response_type == "rule":
            return ChatResponse(
                response=result.response,
                responseType="rule",
                intent=result.intent,
                category=result.category,
                matchType=result.match_type,
                confidence=result.confidence,
                sessionId=session_id,
                pipelineStep="response_delivery"
            )

        # 3. No rule matched: Controlled Local Fallback
        fallback_text = get_fallback_response(user_message)

        return ChatResponse(
            response=fallback_text,
            responseType="fallback",
            intent=None,
            category=None,
            matchType="fallback",
            confidence=0.0,
            sessionId=session_id,
            pipelineStep="response_delivery"
        )
    except Exception as exc:
        # Prevent exposing internal stack traces to the client
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the conversation turn."
        ) from None


