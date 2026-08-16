"""Pydantic schemas and data transfer models for the RuleBot API."""

from typing import Optional, Literal
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Schema for incoming chat messages sent to RuleBot."""
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The user's text message to process."
    )


class ChatResponse(BaseModel):
    """Schema for RuleBot's structured conversation responses."""
    response: str = Field(
        ...,
        description="The deterministic or fallback message from RuleBot."
    )
    responseType: Literal["rule", "gemini", "fallback"] = Field(
        ...,
        description="The classification source of this response."
    )
    intent: Optional[str] = Field(
        None,
        description="The detected intent identifier, or None if fallback."
    )
    category: Optional[str] = Field(
        None,
        description="The logical category group of the matched rule, or None if fallback."
    )
    matchType: Literal["exact", "pattern", "keyword", "none"] = Field(
        ...,
        description="The matching mechanism applied by the rule engine."
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score between 0.0 and 1.0."
    )
    sessionId: str = Field(
        ...,
        description="Unique identifier for the active conversation turn."
    )
    pipelineStep: str = Field(
        default="response_delivery",
        description="Current stage in the RuleBot pipeline."
    )


class HealthResponse(BaseModel):
    """Schema for system health check endpoint."""
    status: str = Field(..., json_schema_extra={"example": "ok"})
    service: str = Field(..., json_schema_extra={"example": "RuleBot"})
