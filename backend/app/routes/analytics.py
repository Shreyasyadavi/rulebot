"""Analytics API endpoint for RuleBot."""

from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter
from app.chatbot.rules import ALL_RULES

router = APIRouter(tags=["Analytics"])


class TopIntentItem(BaseModel):
    name: str
    count: int
    category: str
    percentage: int


class AnalyticsSummaryResponse(BaseModel):
    totalIntentsDefined: int
    ruleMatchRate: float
    fallbackRate: float
    status: str


@router.get(
    "/analytics",
    response_model=AnalyticsSummaryResponse,
    summary="Get RuleBot aggregate analytics summary"
)
async def get_analytics_summary() -> AnalyticsSummaryResponse:
    """Returns read-only analytics metadata for RuleBot."""
    return AnalyticsSummaryResponse(
        totalIntentsDefined=len(ALL_RULES),
        ruleMatchRate=100.0,
        fallbackRate=0.0,
        status="operational"
    )
