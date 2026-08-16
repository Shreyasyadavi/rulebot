"""Deterministic Rule-Based Chatbot Engine for RuleBot.

This module implements the core natural language processing and rule-matching logic:
1. Text Normalization:
   - Lowercases text
   - Strips leading and trailing whitespace
   - Removes non-alphanumeric punctuation (while preserving word boundaries)
   - Collapses multiple whitespace sequences to a single space
2. Multi-tier Matching Engine:
   - Tier 1 (Exact Match): Evaluates if normalized text exactly matches known candidate phrases.
     Confidence: 0.99 (Highest certainty).
   - Tier 2 (Pattern/Regex Match): Evaluates structured regular expressions against input.
     Confidence: 0.95 (High certainty based on phrase grammar structure).
   - Tier 3 (Keyword Match): Checks word-boundary keyword tokens present in user input.
     Confidence: 0.85 - 0.92 (Weighted by keyword length, specificity, and rule priority).
   - Tier 4 (Fallback): Controlled graceful degradation when no deterministic rule satisfies criteria.
     Confidence: 0.00, Intent: None, matchType: 'none'.

Note: Confidence scores are deterministic numerical representations of rule certainty,
not stochastic probabilities produced by a black-box machine learning classifier.
"""

import re
from typing import List, Optional, Tuple, Literal
from dataclasses import dataclass
from .rules import ALL_RULES, Rule


@dataclass
class EngineResult:
    """Encapsulates the decision outcome produced by the Rule Engine."""
    response: str
    response_type: Literal["rule", "fallback"]
    intent: Optional[str]
    category: Optional[str]
    match_type: Literal["exact", "pattern", "keyword", "none"]
    confidence: float
    matched_rule: Optional[Rule] = None


class RuleEngine:
    """Deterministic Rule-Based Matching Engine for natural language conversational turns."""

    def __init__(self, rules: Optional[List[Rule]] = None):
        # Load rules and sort by priority descending
        self.rules: List[Rule] = sorted(
            rules or ALL_RULES,
            key=lambda r: r.priority,
            reverse=True
        )
        self.fallback_response = (
            "I don't have a predefined rule for that question yet."
        )

    def normalize(self, text: str) -> str:
        """Normalizes user input string for reliable deterministic matching.
        
        Steps:
        1. Handle None / empty inputs safely.
        2. Convert all characters to lowercase.
        3. Replace punctuation characters with space.
        4. Collapse multiple spaces into single space and strip boundaries.
        """
        if not text:
            return ""

        # Lowercase and strip
        normalized = text.lower().strip()

        # Remove punctuation like ! ? . , ; : ' " ` ~ @ # $ % ^ & * ( ) _ + = [ ] { } \ | / < >
        # Keep alphanumeric characters and whitespace
        normalized = re.sub(r"[^\w\s]", " ", normalized)

        # Collapse multiple whitespace characters into a single space
        normalized = re.sub(r"\s+", " ", normalized).strip()

        return normalized

    def match(self, user_input: str) -> EngineResult:
        """Executes the 4-tier matching algorithm on the given user input text."""
        # 1. Sanitize and normalize input
        normalized = self.normalize(user_input)

        if not normalized:
            return EngineResult(
                response=self.fallback_response,
                response_type="fallback",
                intent=None,
                category=None,
                match_type="none",
                confidence=0.0
            )

        # 2. Tier 1: Exact Phrase Matching (Highest Confidence: 0.99)
        for rule in self.rules:
            for phrase in rule.exact_phrases:
                if normalized == self.normalize(phrase):
                    return EngineResult(
                        response=rule.responses[0],
                        response_type="rule",
                        intent=rule.intent,
                        category=rule.category,
                        match_type="exact",
                        confidence=0.99,
                        matched_rule=rule
                    )

        # 3. Tier 2: Pattern / Regular Expression Matching (High Confidence: 0.95)
        for rule in self.rules:
            for pattern_str in rule.patterns:
                try:
                    pattern = re.compile(pattern_str, re.IGNORECASE)
                    if pattern.search(normalized):
                        return EngineResult(
                            response=rule.responses[0],
                            response_type="rule",
                            intent=rule.intent,
                            category=rule.category,
                            match_type="pattern",
                            confidence=0.95,
                            matched_rule=rule
                        )
                except re.error:
                    continue

        # 4. Tier 3: Keyword Matching (Medium-High Confidence: 0.85 - 0.92)
        # We test word boundaries so substring false positives (e.g. 'air' matching 'ai') are avoided
        # Multi-word matches (e.g. 'for loop' vs 'loop', 'supervised learning' vs 'ai') receive higher score weighting
        best_keyword_match: Optional[Tuple[Rule, float, float]] = None

        for rule in self.rules:
            matched_keywords_count = 0
            total_matched_token_weight = 0

            for keyword in rule.keywords:
                norm_kw = self.normalize(keyword)
                if not norm_kw:
                    continue

                # Use regex word boundaries for multi-word or single-word keywords
                kw_pattern = rf"\b{re.escape(norm_kw)}\b"
                if re.search(kw_pattern, normalized):
                    matched_keywords_count += 1
                    # Give multi-word keywords heavier weight to prioritize specific intents
                    token_count = len(norm_kw.split())
                    total_matched_token_weight += token_count * 2

            if matched_keywords_count > 0:
                # Calculate match rank: prioritizes rules with longer/more specific keyword matches + rule priority
                match_rank = total_matched_token_weight * 10 + (rule.priority / 10.0)
                confidence_score = min(0.92, 0.85 + (matched_keywords_count - 1) * 0.03)

                if best_keyword_match is None or match_rank > best_keyword_match[2]:
                    best_keyword_match = (rule, confidence_score, match_rank)

        if best_keyword_match is not None:
            matched_rule, confidence_score, _ = best_keyword_match
            return EngineResult(
                response=matched_rule.responses[0],
                response_type="rule",
                intent=matched_rule.intent,
                category=matched_rule.category,
                match_type="keyword",
                confidence=confidence_score,
                matched_rule=matched_rule
            )

        # 5. Tier 4: Graceful Controlled Fallback (Confidence: 0.0)
        return EngineResult(
            response=self.fallback_response,
            response_type="fallback",
            intent=None,
            category=None,
            match_type="none",
            confidence=0.0
        )
