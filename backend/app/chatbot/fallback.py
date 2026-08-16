"""Backend Fallback service for RuleBot.

When the deterministic rule engine does not match any predefined rule,
this module provides a controlled, beginner-friendly local fallback response.
This structure is kept modular so an optional external AI service (like Gemini)
can be safely plugged in later if desired without altering the rule engine.
"""

from typing import Tuple

DEFAULT_FALLBACK_MESSAGE = (
    "I don't have a predefined rule for that question yet. "
    "Try asking me about Python, AI, Machine Learning, or another supported topic."
)


def get_fallback_response(message: str = "") -> str:
    """Returns the controlled local fallback message for unmatched queries.

    Args:
        message: The user's input query.

    Returns:
        The fallback response string.
    """
    return DEFAULT_FALLBACK_MESSAGE


def call_gemini_fallback(message: str = "") -> Tuple[bool, str]:
    """Compatibility hook for optional AI fallback. Currently disabled.

    Returns:
        A tuple of (success=False, fallback_text).
    """
    return False, DEFAULT_FALLBACK_MESSAGE

