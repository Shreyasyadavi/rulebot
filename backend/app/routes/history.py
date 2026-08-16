"""History API endpoint for RuleBot (Read-only metadata)."""

from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter

router = APIRouter(tags=["History"])


class HistorySessionSummary(BaseModel):
    sessionId: str
    startedAt: str
    messageCount: int
    matchedIntents: List[str]
    status: str


class HistoryListResponse(BaseModel):
    sessions: List[HistorySessionSummary]
    totalCount: int


@router.get(
    "/history",
    response_model=HistoryListResponse,
    summary="Get RuleBot conversation history metadata"
)
async def get_history() -> HistoryListResponse:
    """Returns read-only conversation history structure.
    Active session details are persisted client-side in localStorage."""
    return HistoryListResponse(
        sessions=[],
        totalCount=0
    )
