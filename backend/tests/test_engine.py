"""Comprehensive Unit Tests for RuleBot RuleEngine with 55+ Predefined Intents."""

import pytest
from app.chatbot.engine import RuleEngine
from app.chatbot.rules import ALL_RULES


@pytest.fixture
def engine():
    return RuleEngine()


def test_rule_count(engine):
    """Verifies that at least 55 unique rules are loaded across 6 categories."""
    assert len(engine.rules) >= 55
    intents = [r.intent for r in engine.rules]
    assert len(intents) == len(set(intents)), "All rule intents must be unique"
    categories = set(r.category for r in engine.rules)
    expected_categories = {
        "Greetings",
        "Basic Chatbot",
        "Conversation",
        "Python",
        "AI / Machine Learning",
        "General / Project"
    }
    assert expected_categories.issubset(categories)


def test_normalization(engine):
    """Verifies text normalization handling."""
    assert engine.normalize("  HELLO, WORLD!  ") == "hello world"
    assert engine.normalize("What... is??? Python!!") == "what is python"
    assert engine.normalize("   ") == ""
    assert engine.normalize("") == ""
    assert engine.normalize("  \t\n  Machine    Learning???  ") == "machine learning"


# =========================================================================
# TEST ALL 55 INTENTS
# =========================================================================

@pytest.mark.parametrize("query,expected_intent,expected_category", [
    # CATEGORY 1: GREETINGS (5)
    ("hello", "greeting_hello", "Greetings"),
    ("hi there", "greeting_hi", "Greetings"),
    ("hey", "greeting_hey", "Greetings"),
    ("Good morning!", "greeting_good_morning", "Greetings"),
    ("Good evening RuleBot", "greeting_good_evening", "Greetings"),

    # CATEGORY 2: BASIC CHATBOT (8)
    ("What is your name?", "chatbot_name", "Basic Chatbot"),
    ("Who created you?", "chatbot_creator", "Basic Chatbot"),
    ("What can you do?", "chatbot_capabilities", "Basic Chatbot"),
    ("How are you today?", "chatbot_how_are_you", "Basic Chatbot"),
    ("I need help", "chatbot_help", "Basic Chatbot"),
    ("How do you work?", "chatbot_how_it_works", "Basic Chatbot"),
    ("What is a rule based chatbot?", "chatbot_rule_based", "Basic Chatbot"),
    ("What is your version?", "chatbot_version", "Basic Chatbot"),

    # CATEGORY 3: CONVERSATION (7)
    ("Thank you so much!", "thanks", "Conversation"),
    ("You're welcome", "welcome_response", "Conversation"),
    ("Goodbye, see you!", "goodbye", "Conversation"),
    ("See you later", "see_you_later", "Conversation"),
    ("I am sorry", "apology", "Conversation"),
    ("Understood, got it", "confirmation", "Conversation"),
    ("Awesome work!", "positive_response", "Conversation"),

    # CATEGORY 4: PYTHON (16)
    ("What is Python?", "python_definition", "Python"),
    ("Explain variables in Python", "python_variable", "Python"),
    ("What is a list in Python?", "python_list", "Python"),
    ("Explain Python tuples", "python_tuple", "Python"),
    ("What is a dictionary in Python?", "python_dictionary", "Python"),
    ("What is a set in Python?", "python_set", "Python"),
    ("How to write a function in Python?", "python_function", "Python"),
    ("What is a loop in Python?", "python_loop", "Python"),
    ("What is a for loop in Python?", "python_for_loop", "Python"),
    ("What is a while loop in Python?", "python_while_loop", "Python"),
    ("Explain conditionals in Python", "python_conditional", "Python"),
    ("What is a class in Python?", "python_class", "Python"),
    ("What is an object in Python?", "python_object", "Python"),
    ("What is a module in Python?", "python_module", "Python"),
    ("What is an exception in Python?", "python_exception", "Python"),
    ("How to import in Python?", "python_import", "Python"),

    # CATEGORY 5: AI / MACHINE LEARNING (14)
    ("What is AI?", "ai_definition", "AI / Machine Learning"),
    ("What is Machine Learning?", "machine_learning_definition", "AI / Machine Learning"),
    ("Explain supervised learning", "supervised_learning", "AI / Machine Learning"),
    ("What is unsupervised learning?", "unsupervised_learning", "AI / Machine Learning"),
    ("Tell me about reinforcement learning", "reinforcement_learning", "AI / Machine Learning"),
    ("What is deep learning?", "deep_learning", "AI / Machine Learning"),
    ("Tell me about neural networks", "neural_network", "AI / Machine Learning"),
    ("What is training data in machine learning?", "training_data", "AI / Machine Learning"),
    ("What is an AI model?", "model_definition", "AI / Machine Learning"),
    ("What is classification in machine learning?", "classification", "AI / Machine Learning"),
    ("What is regression in machine learning?", "regression", "AI / Machine Learning"),
    ("What is computer vision?", "computer_vision", "AI / Machine Learning"),
    ("What is natural language processing?", "natural_language_processing", "AI / Machine Learning"),
    ("What is generative AI?", "generative_ai", "AI / Machine Learning"),

    # CATEGORY 6: GENERAL / PROJECT (5)
    ("What is the purpose of this project?", "project_purpose", "General / Project"),
    ("What is the internship purpose?", "internship_purpose", "General / Project"),
    ("Difference between rule based and AI?", "rule_vs_ai", "General / Project"),
    ("How does fallback work?", "fallback_explanation", "General / Project"),
    ("How to contact support?", "contact_help", "General / Project"),
])
def test_all_55_intents(engine, query, expected_intent, expected_category):
    """Ensures each of the 55 intents matches accurately with correct category and response."""
    result = engine.match(query)
    assert result.intent == expected_intent, f"Query '{query}' expected intent '{expected_intent}', got '{result.intent}'"
    assert result.category == expected_category, f"Query '{query}' expected category '{expected_category}', got '{result.category}'"
    assert result.response_type == "rule"
    assert result.confidence >= 0.80
    assert len(result.response) > 10


def test_natural_variations_and_casing(engine):
    """Tests uppercase, messy punctuation, and natural phrasing."""
    variations = [
        ("WHAT IS PYTHON???", "python_definition"),
        ("  tell me about python  ", "python_definition"),
        ("Python Meaning", "python_definition"),
        ("Define Python!", "python_definition"),
        ("can you explain python?", "python_definition"),
        ("GOOD MORNING!", "greeting_good_morning"),
        ("  thank   you  very  much!  ", "thanks"),
        ("WHAT IS MACHINE LEARNING?!", "machine_learning_definition"),
        ("tell me about neural networks", "neural_network"),
        ("EXPLAIN SUPERVISED LEARNING", "supervised_learning"),
    ]
    for query, expected_intent in variations:
        res = engine.match(query)
        assert res.intent == expected_intent, f"Failed for variation '{query}'"


def test_avoid_false_matches(engine):
    """Ensures specific multi-word queries match specific intents rather than general parent intents."""
    # 'for loop' should match python_for_loop, not generic python_loop
    res_for = engine.match("What is a for loop in Python?")
    assert res_for.intent == "python_for_loop"

    # 'while loop' should match python_while_loop, not generic python_loop
    res_while = engine.match("Explain while loop in Python")
    assert res_while.intent == "python_while_loop"

    # 'supervised learning' should match supervised_learning, not generic ai_definition or machine_learning_definition
    res_sup = engine.match("Explain supervised learning in AI")
    assert res_sup.intent == "supervised_learning"

    # 'neural network' should match neural_network, not generic ai_definition
    res_nn = engine.match("Tell me about neural networks")
    assert res_nn.intent == "neural_network"

    # 'computer vision' should match computer_vision, not generic ai_definition
    res_cv = engine.match("What is computer vision?")
    assert res_cv.intent == "computer_vision"


def test_fallback_unmatched_queries(engine):
    """Tests unknown questions properly fallback with zero confidence and matchType none."""
    unknown_queries = [
        "What is the capital of France?",
        "How do I bake sourdough bread?",
        "Can you book a flight to Tokyo?",
        "asdfghjkl qwerty 123456"
    ]
    for query in unknown_queries:
        res = engine.match(query)
        assert res.response_type == "fallback"
        assert res.intent is None
        assert res.category is None
        assert res.match_type == "none"
        assert res.confidence == 0.0
        assert "predefined rule" in res.response
