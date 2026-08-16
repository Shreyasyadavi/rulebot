"""Predefined deterministic rules and intent configurations for RuleBot.

Contains 55 clearly defined intents across 6 core categories:
1. Greetings (5 intents)
2. Basic Chatbot (8 intents)
3. Conversation (7 intents)
4. Python Concepts (16 intents)
5. AI / Machine Learning (14 intents)
6. General / Project (5 intents)

Each rule defines:
- intent: unique identifier for the detected intent
- category: logical category group
- exact_phrases: full phrase exact matches that yield top priority (Tier 1)
- patterns: regular expression patterns checked for pattern matching (Tier 2)
- keywords: individual terms or specific sub-phrases checked during keyword matching (Tier 3)
- responses: list of predefined deterministic educational candidate responses
- priority: integer sorting weight (higher number = evaluated first)
"""

from typing import List

try:
    from pydantic import BaseModel, Field

    class Rule(BaseModel):
        """Data model representing a deterministic chatbot rule."""
        intent: str
        category: str
        exact_phrases: List[str] = Field(default_factory=list)
        keywords: List[str] = Field(default_factory=list)
        patterns: List[str] = Field(default_factory=list)
        responses: List[str] = Field(default_factory=list)
        priority: int = 50
except ImportError:
    from dataclasses import dataclass, field

    @dataclass
    class Rule:  # type: ignore
        """Data model representing a deterministic chatbot rule."""
        intent: str
        category: str
        exact_phrases: List[str] = field(default_factory=list)
        keywords: List[str] = field(default_factory=list)
        patterns: List[str] = field(default_factory=list)
        responses: List[str] = field(default_factory=list)
        priority: int = 50


ALL_RULES: List[Rule] = [
    # =========================================================================
    # CATEGORY 1 — GREETINGS (5 intents)
    # =========================================================================
    Rule(
        intent="greeting_hello",
        category="Greetings",
        exact_phrases=["hello", "hello rulebot", "hello there", "hello assistant"],
        keywords=["hello"],
        patterns=[r"^hello(\s+(there|rulebot|bot|assistant|friend))?$"],
        responses=[
            "Hello! Welcome to RuleBot. How can I help you today?",
            "Hello there! What programming or AI topic would you like to explore?"
        ],
        priority=90
    ),
    Rule(
        intent="greeting_hi",
        category="Greetings",
        exact_phrases=["hi", "hi there", "hi rulebot", "hi bot"],
        keywords=["hi"],
        patterns=[r"^hi(\s+(there|rulebot|bot|assistant))?$"],
        responses=[
            "Hi there! How can I assist you with your questions today?",
            "Hi! Ask me anything about Python, AI, Machine Learning, or how this rule engine works."
        ],
        priority=89
    ),
    Rule(
        intent="greeting_hey",
        category="Greetings",
        exact_phrases=["hey", "hey there", "heyy", "hey rulebot"],
        keywords=["hey", "heyy"],
        patterns=[r"^hey+(\s+(there|rulebot|bot))?$"],
        responses=[
            "Hey! Great to see you. How can I help you today?",
            "Hey there! What topic would you like to discuss?"
        ],
        priority=88
    ),
    Rule(
        intent="greeting_good_morning",
        category="Greetings",
        exact_phrases=["good morning", "morning", "good morning rulebot", "good morning assistant"],
        keywords=["good morning", "morning"],
        patterns=[r"^good\s+morning(\s+(rulebot|all|there))?$"],
        responses=[
            "Good morning! Hope you have a productive day of learning. How can I help?",
            "Good morning! Ready to explore Python and AI concepts today?"
        ],
        priority=92
    ),
    Rule(
        intent="greeting_good_evening",
        category="Greetings",
        exact_phrases=["good evening", "good afternoon", "good evening rulebot", "evening"],
        keywords=["good evening", "good afternoon", "evening"],
        patterns=[r"^good\s+(evening|afternoon)(\s+(rulebot|there))?$"],
        responses=[
            "Good evening! Hope your day went well. What can I assist you with?",
            "Good evening! Let me know what programming or machine learning questions you have."
        ],
        priority=92
    ),

    # =========================================================================
    # CATEGORY 2 — BASIC CHATBOT (8 intents)
    # =========================================================================
    Rule(
        intent="chatbot_name",
        category="Basic Chatbot",
        exact_phrases=[
            "what is your name", "who are you", "what are you called",
            "your name", "what's your name", "tell me your name"
        ],
        keywords=["your name", "who are you", "what are you called"],
        patterns=[
            r"^what(\s+is|\'s)\s+your\s+name$",
            r"^who\s+are\s+you$",
            r"^what\s+should\s+i\s+call\s+you$"
        ],
        responses=[
            "My name is RuleBot! I am a deterministic, rule-based conversational assistant designed for transparent AI/ML concepts.",
            "I'm RuleBot, an educational chatbot engine built with Python and FastAPI."
        ],
        priority=85
    ),
    Rule(
        intent="chatbot_creator",
        category="Basic Chatbot",
        exact_phrases=[
            "who created you", "who made you", "who built you",
            "who is your author", "who developed you", "who is your creator"
        ],
        keywords=["who created you", "who made you", "who built you", "who developed you"],
        patterns=[
            r"^who\s+(created|made|built|developed|programmed)\s+you$",
            r"^who\s+is\s+your\s+(creator|author|developer)$"
        ],
        responses=[
            "I was created as an AI/ML internship project to demonstrate rule-based NLP architecture and deterministic intent parsing.",
            "I was developed using modern Python and FastAPI as a foundational NLP showcase."
        ],
        priority=85
    ),
    Rule(
        intent="chatbot_capabilities",
        category="Basic Chatbot",
        exact_phrases=[
            "what can you do", "what are your capabilities", "what are your features",
            "what can i ask you", "what topics do you know", "list your capabilities"
        ],
        keywords=["what can you do", "capabilities", "features", "what can i ask"],
        patterns=[
            r"^what\s+can\s+you\s+do(\s+for\s+me)?$",
            r"^what\s+are\s+your\s+(capabilities|features|skills|functions)$",
            r"^what\s+topics\s+(can\s+i\s+ask|do\s+you\s+cover)$"
        ],
        responses=[
            "I can answer questions across 6 categories: Python fundamentals, AI and Machine Learning definitions, chatbot architecture, conversational greetings, and project insights.",
            "My capabilities include deterministic intent matching for Python concepts, AI/ML terminology, and explaining rule-based chatbot pipelines."
        ],
        priority=86
    ),
    Rule(
        intent="chatbot_how_are_you",
        category="Basic Chatbot",
        exact_phrases=[
            "how are you", "how are you doing", "how do you do",
            "how are you today", "are you doing well", "how's it going"
        ],
        keywords=["how are you", "how do you do", "hows it going"],
        patterns=[
            r"^how\s+are\s+you(\s+doing|\s+today)?$",
            r"^how(\s+is|\'s)\s+it\s+going$"
        ],
        responses=[
            "I'm operating at 100% efficiency and ready to assist you! How are you doing?",
            "I'm doing fantastic! All rule pipelines are active and ready for your queries."
        ],
        priority=84
    ),
    Rule(
        intent="chatbot_help",
        category="Basic Chatbot",
        exact_phrases=[
            "help", "help me", "i need help", "can you help me",
            "give me help", "assistance", "support"
        ],
        keywords=["help", "help me", "assistance"],
        patterns=[
            r"^help(\s+me|\s+please)?$",
            r"^i\s+need\s+(help|assistance|support)$",
            r"^can\s+you\s+help\s+me$"
        ],
        responses=[
            "I'm here to help! You can ask me about Python (e.g., 'What is a list?'), Machine Learning (e.g., 'What is supervised learning?'), or chatbot logic.",
            "Need assistance? Try asking technical questions like 'What is a function in Python?' or 'Explain neural networks'."
        ],
        priority=83
    ),
    Rule(
        intent="chatbot_how_it_works",
        category="Basic Chatbot",
        exact_phrases=[
            "how do you work", "how does this chatbot work", "explain how you work",
            "how does rulebot work", "how do rules work"
        ],
        keywords=["how do you work", "how does this work", "how rulebot works"],
        patterns=[
            r"^how\s+(do\s+you|does\s+(this|rulebot))\s+work$",
            r"^explain\s+how\s+(you|this\s+engine)\s+works?$"
        ],
        responses=[
            "I work through a 4-tier deterministic pipeline: 1. Input Normalization, 2. Exact phrase matching, 3. Pattern/Regex evaluation, 4. Keyword token analysis. If no rule matches, a controlled fallback is returned.",
            "When you send a message, my Python engine sanitizes the text and evaluates prioritized rules without relying on non-deterministic external models."
        ],
        priority=85
    ),
    Rule(
        intent="chatbot_rule_based",
        category="Basic Chatbot",
        exact_phrases=[
            "what is a rule based chatbot", "define rule based chatbot",
            "explain rule based chatbot", "what does rule based mean", "what is rule based"
        ],
        keywords=["rule based chatbot", "rule based", "rule-based"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?rule\s+based(\s+chatbot|\s+system)?$",
            r"^what\s+does\s+rule\s+based\s+mean$"
        ],
        responses=[
            "A rule-based chatbot uses predefined conditional logic, exact patterns, and keyword matching to deliver deterministic, predictable responses without stochastic randomness.",
            "Rule-based bots follow explicit if-then logic and pattern grammars created by developers, offering high reliability, zero hallucination, and full explainability."
        ],
        priority=85
    ),
    Rule(
        intent="chatbot_version",
        category="Basic Chatbot",
        exact_phrases=[
            "what version are you", "what is your version", "rulebot version",
            "current version", "version info"
        ],
        keywords=["version", "version info", "current version"],
        patterns=[
            r"^what(\s+is|\'s)\s+your\s+version$",
            r"^(rulebot\s+)?version(\s+info)?$"
        ],
        responses=[
            "I am currently running RuleBot version 1.0.0, powered by Python 3.10 and FastAPI.",
            "RuleBot v1.0.0 is active with 55+ deterministic intent rules."
        ],
        priority=80
    ),

    # =========================================================================
    # CATEGORY 3 — CONVERSATION (7 intents)
    # =========================================================================
    Rule(
        intent="thanks",
        category="Conversation",
        exact_phrases=[
            "thank you", "thanks", "thanks a lot", "thank you so much",
            "many thanks", "thx", "i appreciate it"
        ],
        keywords=["thank you", "thanks", "thx", "appreciate it"],
        patterns=[
            r"^thank(s|\s+you)(\s+(so\s+much|very\s+much|a\s+lot))?$",
            r"^many\s+thanks$",
            r"^i\s+appreciate\s+(it|your\s+help)$"
        ],
        responses=[
            "You're very welcome! Feel free to ask whenever you have more questions.",
            "Happy to help! Let me know if you want to explore another topic."
        ],
        priority=87
    ),
    Rule(
        intent="welcome_response",
        category="Conversation",
        exact_phrases=[
            "you are welcome", "you're welcome", "no problem",
            "no worries", "anytime", "dont mention it"
        ],
        keywords=["you're welcome", "you are welcome", "no problem", "no worries"],
        patterns=[
            r"^you(\'re|\s+are)\s+welcome$",
            r"^no\s+(problem|worries)$",
            r"^anytime$"
        ],
        responses=[
            "Glad I could be of assistance! What's next on your agenda?",
            "Always happy to assist! What else would you like to explore?"
        ],
        priority=82
    ),
    Rule(
        intent="goodbye",
        category="Conversation",
        exact_phrases=[
            "bye", "goodbye", "farewell", "cya", "bye bye", "have a good day"
        ],
        keywords=["goodbye", "bye", "farewell", "cya"],
        patterns=[
            r"^(bye|goodbye|farewell|cya|bye\s+bye)$",
            r"^have\s+a\s+(good|great|nice)\s+day$"
        ],
        responses=[
            "Goodbye! Have a great day ahead and happy coding!",
            "Farewell! Feel free to return anytime you need technical explanations."
        ],
        priority=89
    ),
    Rule(
        intent="see_you_later",
        category="Conversation",
        exact_phrases=[
            "see you later", "see ya", "see you soon", "catch you later", "talk to you later"
        ],
        keywords=["see you later", "see ya", "see you soon", "catch you later"],
        patterns=[
            r"^see\s+(you|ya)(\s+later|\s+soon)?$",
            r"^(catch|talk\s+to)\s+you\s+later$"
        ],
        responses=[
            "See you later! Looking forward to our next conversation.",
            "Catch you later! Keep experimenting with code."
        ],
        priority=88
    ),
    Rule(
        intent="apology",
        category="Conversation",
        exact_phrases=[
            "i am sorry", "sorry", "my apologies", "my bad", "excuse me"
        ],
        keywords=["sorry", "i am sorry", "apologies", "my bad"],
        patterns=[
            r"^(i\s+am\s+)?sorry$",
            r"^my\s+(apologies|bad)$"
        ],
        responses=[
            "No problem at all! No need to apologize.",
            "No worries! Let's continue exploring."
        ],
        priority=81
    ),
    Rule(
        intent="confirmation",
        category="Conversation",
        exact_phrases=[
            "ok", "okay", "got it", "understood", "alright", "i see", "sure"
        ],
        keywords=["okay", "got it", "understood", "alright"],
        patterns=[
            r"^(ok|okay|got\s+it|understood|alright|i\s+see|sure)$"
        ],
        responses=[
            "Understood! What would you like to look at next?",
            "Great! Let me know if you have any follow-up questions."
        ],
        priority=80
    ),
    Rule(
        intent="positive_response",
        category="Conversation",
        exact_phrases=[
            "great", "awesome", "perfect", "excellent", "nice", "cool", "wonderful"
        ],
        keywords=["awesome", "excellent", "wonderful"],
        patterns=[
            r"^(great|awesome|perfect|excellent|nice|cool|wonderful)(\s+job|\s+work)?$"
        ],
        responses=[
            "Glad you like it! What other concept can we dive into?",
            "Awesome! Feel free to ask more questions whenever you're ready."
        ],
        priority=80
    ),

    # =========================================================================
    # CATEGORY 4 — PYTHON (16 intents)
    # =========================================================================
    Rule(
        intent="python_definition",
        category="Python",
        exact_phrases=[
            "what is python", "python", "tell me about python", "define python",
            "explain python", "python programming", "python language"
        ],
        keywords=["python programming", "python language", "python"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+python(\s+programming|\s+language)?$",
            r"^python(\s+overview|\s+definition|\s+language)?$"
        ],
        responses=[
            "Python is a high-level, interpreted, general-purpose programming language renowned for its clean syntax, readability, and vast ecosystem in AI, web backend, and data science.",
            "Python is a versatile programming language created by Guido van Rossum that emphasizes code readability and programmer productivity."
        ],
        priority=75
    ),
    Rule(
        intent="python_variable",
        category="Python",
        exact_phrases=[
            "what is a variable in python", "what is a variable", "python variable",
            "define python variable", "explain variables in python", "python variables"
        ],
        keywords=["python variable", "python variables", "variable in python", "variable"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(variable|variables)(\s+in\s+python)?$",
            r"^python\s+variables?$"
        ],
        responses=[
            "In Python, a variable is a named reference that points to a value stored in computer memory. Variables are created automatically when you assign a value using the '=' operator.",
            "Variables in Python are dynamically typed references to objects, meaning you do not need to explicitly declare their data types before assigning values."
        ],
        priority=74
    ),
    Rule(
        intent="python_list",
        category="Python",
        exact_phrases=[
            "what is a list in python", "what is a list", "python list",
            "define python list", "explain python lists", "python lists"
        ],
        keywords=["python list", "python lists", "list in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(list|lists)(\s+in\s+python)?$",
            r"^python\s+lists?$"
        ],
        responses=[
            "A list in Python is an ordered, mutable collection of items enclosed in square brackets `[1, 2, 3]`. Lists can store elements of different data types and support dynamic resizing.",
            "Python lists are zero-indexed sequences that allow duplicate items, indexing, slicing, and methods like `append()`, `pop()`, and `sort()`."
        ],
        priority=74
    ),
    Rule(
        intent="python_tuple",
        category="Python",
        exact_phrases=[
            "what is a tuple in python", "what is a tuple", "python tuple",
            "define python tuple", "explain python tuples", "python tuples"
        ],
        keywords=["python tuple", "python tuples", "tuple in python", "tuple"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(tuple|tuples)(\s+in\s+python)?$",
            r"^python\s+tuples?$"
        ],
        responses=[
            "A tuple in Python is an ordered, immutable collection enclosed in parentheses `(1, 2, 3)`. Because tuples cannot be altered after creation, they are faster and memory-efficient.",
            "Tuples are fixed-length sequences in Python. They are often used to group related data and can serve as dictionary keys because they are hashable."
        ],
        priority=74
    ),
    Rule(
        intent="python_dictionary",
        category="Python",
        exact_phrases=[
            "what is a dictionary in python", "what is a dictionary", "python dictionary",
            "define python dict", "explain python dictionaries", "python dict"
        ],
        keywords=["python dictionary", "python dict", "dictionary in python", "dict in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(dict|dictionary|dictionaries)(\s+in\s+python)?$",
            r"^python\s+(dict|dictionary|dictionaries)$"
        ],
        responses=[
            "A dictionary in Python is an unordered collection of key-value pairs enclosed in curly braces `{'key': 'value'}`. Keys must be unique and immutable, offering O(1) average lookup time.",
            "Python dictionaries store mappings between unique keys and corresponding values, supporting operations like `.keys()`, `.values()`, and `.items()`."
        ],
        priority=74
    ),
    Rule(
        intent="python_set",
        category="Python",
        exact_phrases=[
            "what is a set in python", "what is a set", "python set",
            "define python set", "explain python sets", "python sets"
        ],
        keywords=["python set", "python sets", "set in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(set|sets)(\s+in\s+python)?$",
            r"^python\s+sets?$"
        ],
        responses=[
            "A set in Python is an unordered collection of unique, mutable elements enclosed in curly braces `{1, 2, 3}`. Sets automatically eliminate duplicate values and support mathematical set operations.",
            "Python sets are highly optimized for membership testing (`in` operator) and union, intersection, and difference operations."
        ],
        priority=74
    ),
    Rule(
        intent="python_function",
        category="Python",
        exact_phrases=[
            "what is a function in python", "what is a function", "python function",
            "define python function", "explain python functions", "how to write a function in python"
        ],
        keywords=["python function", "python functions", "function in python", "def in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(function|functions)(\s+in\s+python)?$",
            r"^python\s+functions?$",
            r"^how\s+(to|do\s+i)\s+(define|write|create)\s+a\s+function(\s+in\s+python)?$"
        ],
        responses=[
            "A function in Python is a reusable block of code defined using the `def` keyword that executes only when called. Functions can accept parameters and return values using `return`.",
            "Functions help organize code into modular, maintainable, and testable components, avoiding code duplication."
        ],
        priority=74
    ),
    Rule(
        intent="python_for_loop",
        category="Python",
        exact_phrases=[
            "what is a for loop in python", "python for loop", "what is a for loop",
            "explain for loop in python", "for loop python", "for loop"
        ],
        keywords=["python for loop", "for loop in python", "for loop"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?for\s+loop(\s+in\s+python)?$",
            r"^python\s+for\s+loops?$",
            r"^for\s+loop(\s+in\s+python)?$"
        ],
        responses=[
            "A `for` loop in Python iterates over members of a sequence (like a list, tuple, string, or range), executing a block of statements for each item.",
            "Python's `for item in iterable:` syntax provides clean and readable iteration without requiring manual index counter tracking."
        ],
        priority=76  # Higher priority than generic python_loop
    ),
    Rule(
        intent="python_while_loop",
        category="Python",
        exact_phrases=[
            "what is a while loop in python", "python while loop", "what is a while loop",
            "explain while loop in python", "while loop python", "while loop"
        ],
        keywords=["python while loop", "while loop in python", "while loop"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?while\s+loop(\s+in\s+python)?$",
            r"^python\s+while\s+loops?$",
            r"^while\s+loop(\s+in\s+python)?$"
        ],
        responses=[
            "A `while` loop in Python repeatedly executes a block of code as long as a specified boolean condition evaluates to `True`.",
            "While loops are ideal when the exact number of iterations is unknown in advance and depends on dynamic runtime conditions."
        ],
        priority=76  # Higher priority than generic python_loop
    ),
    Rule(
        intent="python_loop",
        category="Python",
        exact_phrases=[
            "what is a loop in python", "what is a loop", "python loop",
            "define python loop", "explain loops in python", "python loops"
        ],
        keywords=["python loop", "python loops", "loops in python", "loop in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(loop|loops)(\s+in\s+python)?$",
            r"^python\s+loops?$"
        ],
        responses=[
            "Loops in Python allow you to execute a block of code multiple times. Python supports two main loop constructs: `for` loops (for definite iteration) and `while` loops (for condition-based iteration).",
            "Python provides `for` and `while` loops alongside control flow keywords like `break`, `continue`, and `else`."
        ],
        priority=73
    ),
    Rule(
        intent="python_conditional",
        category="Python",
        exact_phrases=[
            "what is a conditional in python", "python if statement", "python conditionals",
            "explain conditionals in python", "if else in python", "python if else"
        ],
        keywords=["python conditional", "if else in python", "if statement in python", "conditionals in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(conditional|if\s+statement|if\s+else)(\s+in\s+python)?$",
            r"^python\s+(conditionals?|if\s+statements?)$"
        ],
        responses=[
            "Conditionals in Python (`if`, `elif`, `else`) enable decision making by executing different blocks of code based on whether a condition evaluates to `True` or `False`.",
            "Python uses indentation to define code blocks under `if`, `elif`, and `else` statements."
        ],
        priority=74
    ),
    Rule(
        intent="python_class",
        category="Python",
        exact_phrases=[
            "what is a class in python", "what is a class", "python class",
            "define python class", "explain classes in python", "python classes"
        ],
        keywords=["python class", "python classes", "class in python", "classes in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(class|classes)(\s+in\s+python)?$",
            r"^python\s+class(es)?$"
        ],
        responses=[
            "A class in Python is a blueprint or template for creating objects. It encapsulates data attributes and methods (functions) using the `class` keyword and `__init__` constructor.",
            "Classes are the foundation of Object-Oriented Programming (OOP) in Python, facilitating encapsulation, inheritance, and polymorphism."
        ],
        priority=74
    ),
    Rule(
        intent="python_object",
        category="Python",
        exact_phrases=[
            "what is an object in python", "what is an object", "python object",
            "define python object", "explain objects in python", "python objects"
        ],
        keywords=["python object", "python objects", "object in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(an\s+)?(object|objects)(\s+in\s+python)?$",
            r"^python\s+objects?$"
        ],
        responses=[
            "An object in Python is an instance of a class that holds concrete data values and associated behaviors. In Python, virtually everything—including functions, numbers, and strings—is an object.",
            "Objects combine state (variables) and behavior (methods), instantiated from a parent class."
        ],
        priority=74
    ),
    Rule(
        intent="python_module",
        category="Python",
        exact_phrases=[
            "what is a module in python", "what is a module", "python module",
            "define python module", "explain modules in python", "python modules"
        ],
        keywords=["python module", "python modules", "module in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(module|modules)(\s+in\s+python)?$",
            r"^python\s+modules?$"
        ],
        responses=[
            "A module in Python is simply a `.py` file containing Python code, functions, and classes that can be imported and reused across other programs.",
            "Python modules encourage code reuse and separation of concerns. Examples of standard modules include `math`, `os`, `sys`, and `json`."
        ],
        priority=74
    ),
    Rule(
        intent="python_exception",
        category="Python",
        exact_phrases=[
            "what is an exception in python", "python exception", "try except python",
            "explain exceptions in python", "error handling in python", "python exceptions"
        ],
        keywords=["python exception", "try except python", "error handling in python", "exception in python"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(an\s+)?(exception|exceptions|error\s+handling)(\s+in\s+python)?$",
            r"^python\s+(exceptions?|try\s+except)$"
        ],
        responses=[
            "An exception in Python is an event that disrupts the normal flow of a program during runtime. Exceptions are gracefully handled using `try`, `except`, `else`, and `finally` blocks.",
            "Python exception handling allows programs to intercept errors (like `ZeroDivisionError` or `ValueError`) without unexpectedly crashing."
        ],
        priority=74
    ),
    Rule(
        intent="python_import",
        category="Python",
        exact_phrases=[
            "how to import in python", "what is import in python", "python import statement",
            "explain python import", "how import works in python", "python import"
        ],
        keywords=["python import", "import in python", "import statement in python"],
        patterns=[
            r"^(what\s+is|define|explain|how\s+to\s+use)\s+(the\s+)?import(\s+statement)?(\s+in\s+python)?$",
            r"^how\s+(do\s+i|to)\s+import(\s+modules|\s+packages)?(\s+in\s+python)?$"
        ],
        responses=[
            "The `import` statement in Python loads external or built-in modules into your current namespace, e.g., `import math` or `from datetime import datetime`.",
            "Python's `import` keyword allows you to access code, functions, and classes from the standard library or third-party packages installed via pip."
        ],
        priority=74
    ),

    # =========================================================================
    # CATEGORY 5 — AI / MACHINE LEARNING (14 intents)
    # =========================================================================
    Rule(
        intent="ai_definition",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is ai", "ai", "what is artificial intelligence", "define ai",
            "explain ai", "tell me about ai", "artificial intelligence"
        ],
        keywords=["artificial intelligence", "what is ai", "define ai"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+(ai|artificial\s+intelligence)$",
            r"^(ai|artificial\s+intelligence)(\s+definition|\s+overview)?$"
        ],
        responses=[
            "Artificial Intelligence (AI) is the field of computer science dedicated to building computational systems capable of performing tasks that traditionally require human intelligence, such as visual recognition, language understanding, reasoning, and planning.",
            "AI encompasses machine learning, deep learning, rule engines, robotics, and knowledge representation systems that solve complex analytical challenges."
        ],
        priority=70
    ),
    Rule(
        intent="machine_learning_definition",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is machine learning", "machine learning", "what is ml",
            "define machine learning", "explain machine learning", "ml"
        ],
        keywords=["machine learning", "what is machine learning", "what is ml", "define machine learning"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+(machine\s+learning|ml)$",
            r"^(machine\s+learning|ml)(\s+definition|\s+overview)?$"
        ],
        responses=[
            "Machine Learning (ML) is a subset of AI focused on building algorithms that learn patterns and relationships directly from data, allowing systems to make predictions or decisions without being explicitly programmed for every scenario.",
            "ML systems improve their accuracy iteratively over time as they are exposed to more training data."
        ],
        priority=72
    ),
    Rule(
        intent="supervised_learning",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is supervised learning", "define supervised learning", "explain supervised learning",
            "supervised learning", "supervised machine learning", "tell me about supervised learning"
        ],
        keywords=["supervised learning", "supervised machine learning", "supervised ml"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+supervised\s+(learning|machine\s+learning|ml)$",
            r"^supervised\s+(learning|ml)(\s+definition)?$"
        ],
        responses=[
            "Supervised Learning is a machine learning paradigm where models are trained on labeled datasets—meaning each training sample includes input features paired with the correct output target (e.g., classification and regression).",
            "In supervised learning, the algorithm learns a mathematical mapping function from inputs to outputs by minimizing the loss between its predictions and ground truth labels."
        ],
        priority=75
    ),
    Rule(
        intent="unsupervised_learning",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is unsupervised learning", "define unsupervised learning", "explain unsupervised learning",
            "unsupervised learning", "unsupervised machine learning", "tell me about unsupervised learning"
        ],
        keywords=["unsupervised learning", "unsupervised machine learning", "unsupervised ml"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+unsupervised\s+(learning|machine\s+learning|ml)$",
            r"^unsupervised\s+(learning|ml)(\s+definition)?$"
        ],
        responses=[
            "Unsupervised Learning is a machine learning method where models discover hidden patterns, clusters, or intrinsic structures in unlabeled data without explicit guidance or target tags (e.g., K-Means clustering, PCA).",
            "Unsupervised algorithms analyze raw data distributions to identify groupings, anomalies, and feature embeddings on their own."
        ],
        priority=75
    ),
    Rule(
        intent="reinforcement_learning",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is reinforcement learning", "define reinforcement learning", "explain reinforcement learning",
            "reinforcement learning", "tell me about reinforcement learning", "rl"
        ],
        keywords=["reinforcement learning", "rl in ai", "reinforcement machine learning"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+reinforcement\s+(learning|ml)$",
            r"^reinforcement\s+learning(\s+definition)?$"
        ],
        responses=[
            "Reinforcement Learning (RL) is an area of machine learning where an autonomous agent learns to make optimal decisions by interacting with an environment, receiving rewards for desirable actions and penalties for mistakes.",
            "In RL, the agent seeks to maximize cumulative rewards over time through trial-and-error exploration and policy optimization."
        ],
        priority=75
    ),
    Rule(
        intent="deep_learning",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is deep learning", "define deep learning", "explain deep learning",
            "deep learning", "tell me about deep learning", "what does deep learning mean"
        ],
        keywords=["deep learning", "what is deep learning", "define deep learning"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+deep\s+learning$",
            r"^deep\s+learning(\s+definition)?$"
        ],
        responses=[
            "Deep Learning is a subfield of machine learning based on artificial neural networks with multiple hidden layers ('deep' architectures), capable of learning hierarchical feature representations from raw data like images and text.",
            "Deep Learning powers breakthroughs in computer vision, automated speech recognition, natural language processing, and generative AI."
        ],
        priority=74
    ),
    Rule(
        intent="neural_network",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is a neural network", "what are neural networks", "define neural network",
            "explain neural networks", "neural network", "neural networks", "tell me about neural networks"
        ],
        keywords=["neural network", "neural networks", "artificial neural network", "ann"],
        patterns=[
            r"^(what\s+(is|are)|define|explain|tell\s+me\s+about)\s+(a\s+)?(neural\s+network|neural\s+networks|ann)$",
            r"^neural\s+networks?(\s+definition)?$"
        ],
        responses=[
            "An Artificial Neural Network (ANN) is a computational model inspired by the biological brain, composed of interconnected layers of artificial neurons (nodes) that transform inputs through weighted mathematical operations and activation functions.",
            "Neural networks pass signals through input, hidden, and output layers, updating connection weights via backpropagation during training."
        ],
        priority=74
    ),
    Rule(
        intent="training_data",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is training data", "define training data", "explain training data",
            "training data in machine learning", "training dataset", "training data"
        ],
        keywords=["training data", "training dataset", "training set in machine learning"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(the\s+)?training\s+(data|dataset|set)(\s+in\s+ml|\s+in\s+ai)?$",
            r"^training\s+(data|dataset)$"
        ],
        responses=[
            "Training data is the initial dataset fed into a machine learning algorithm to help it discover patterns, optimize parameters, and learn relationships between features and target outcomes.",
            "High-quality, representative training data is essential for building accurate and unbiased machine learning models."
        ],
        priority=73
    ),
    Rule(
        intent="model_definition",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is a machine learning model", "what is an ai model", "what is a model in ml",
            "define ml model", "explain machine learning model", "ml model"
        ],
        keywords=["machine learning model", "ml model", "ai model", "model in machine learning"],
        patterns=[
            r"^(what\s+is|define|explain)\s+(a\s+)?(machine\s+learning|ml|ai)\s+model$",
            r"^(ml|ai)\s+model(\s+definition)?$"
        ],
        responses=[
            "An ML model is the output of training an algorithm on a dataset—a mathematical representation or programmatic artifact capable of receiving new input data and producing predictions.",
            "In machine learning, a model represents learned parameters (such as weights and biases) that capture the underlying statistical distribution of training data."
        ],
        priority=73
    ),
    Rule(
        intent="classification",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is classification in machine learning", "what is classification",
            "define classification", "explain classification in ml", "classification in ai"
        ],
        keywords=["classification in machine learning", "classification in ml", "classification task"],
        patterns=[
            r"^(what\s+is|define|explain)\s+classification(\s+in\s+(ml|machine\s+learning|ai))?$",
            r"^classification(\s+in\s+ml|\s+algorithm)?$"
        ],
        responses=[
            "Classification is a supervised learning task where the model predicts discrete categorical class labels for given inputs (for example, identifying whether an email is 'Spam' or 'Not Spam').",
            "Common classification algorithms include Logistic Regression, Decision Trees, Random Forests, Support Vector Machines (SVM), and Neural Networks."
        ],
        priority=73
    ),
    Rule(
        intent="regression",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is regression in machine learning", "what is regression",
            "define regression", "explain regression in ml", "regression in ai"
        ],
        keywords=["regression in machine learning", "regression in ml", "regression task"],
        patterns=[
            r"^(what\s+is|define|explain)\s+regression(\s+in\s+(ml|machine\s+learning|ai))?$",
            r"^regression(\s+in\s+ml|\s+algorithm)?$"
        ],
        responses=[
            "Regression is a supervised learning task where the model predicts continuous numerical values (such as house prices, stock values, or temperatures) based on input features.",
            "Standard regression techniques include Linear Regression, Polynomial Regression, Ridge, Lasso, and Gradient Boosted Trees."
        ],
        priority=73
    ),
    Rule(
        intent="computer_vision",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is computer vision", "define computer vision", "explain computer vision",
            "computer vision", "tell me about computer vision", "cv in ai"
        ],
        keywords=["computer vision", "cv in ai", "image recognition in ai"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+computer\s+vision$",
            r"^computer\s+vision(\s+definition)?$"
        ],
        responses=[
            "Computer Vision is an AI subfield that trains computers to interpret, analyze, and extract meaningful information from digital images, videos, and visual inputs.",
            "Applications of computer vision include facial recognition, medical image diagnostics, autonomous vehicles, and object detection."
        ],
        priority=74
    ),
    Rule(
        intent="natural_language_processing",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is natural language processing", "what is nlp", "define natural language processing",
            "explain nlp", "tell me about natural language processing", "natural language processing", "nlp"
        ],
        keywords=["natural language processing", "nlp", "nlp in ai"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+(nlp|natural\s+language\s+processing)$",
            r"^(nlp|natural\s+language\s+processing)(\s+definition)?$"
        ],
        responses=[
            "Natural Language Processing (NLP) is a domain of AI that enables computers to understand, interpret, manipulate, and generate human language in text or speech.",
            "NLP combines computational linguistics, rule engines, and machine learning models for tasks like machine translation, sentiment analysis, and conversational chatbots."
        ],
        priority=74
    ),
    Rule(
        intent="generative_ai",
        category="AI / Machine Learning",
        exact_phrases=[
            "what is generative ai", "define generative ai", "explain generative ai",
            "generative ai", "tell me about generative ai", "gen ai"
        ],
        keywords=["generative ai", "gen ai", "generative artificial intelligence"],
        patterns=[
            r"^(what\s+is|define|explain|tell\s+me\s+about)\s+(gen\s+ai|generative\s+ai|generative\s+artificial\s+intelligence)$",
            r"^generative\s+ai(\s+definition)?$"
        ],
        responses=[
            "Generative AI refers to artificial intelligence models capable of generating novel synthetic content—such as text, code, images, audio, and video—by learning patterns from existing data.",
            "Generative AI models include Large Language Models (LLMs), Diffusion models for images, and Generative Adversarial Networks (GANs)."
        ],
        priority=74
    ),

    # =========================================================================
    # CATEGORY 6 — GENERAL / PROJECT (5 intents)
    # =========================================================================
    Rule(
        intent="project_purpose",
        category="General / Project",
        exact_phrases=[
            "what is the purpose of this project", "project purpose", "why was this project made",
            "what is this project for", "tell me about this project", "about this project"
        ],
        keywords=["purpose of this project", "project purpose", "why this project was created"],
        patterns=[
            r"^what\s+is\s+the\s+purpose\s+of\s+(this\s+)?project$",
            r"^(about|tell\s+me\s+about)\s+this\s+project$"
        ],
        responses=[
            "The purpose of the RuleBot project is to demonstrate a clean, deterministic rule-based chatbot architecture paired with an interactive logic inspector for educational AI/ML workflows.",
            "This project illustrates foundational NLP concepts, deterministic intent parsing, FastAPI backend engineering, and transparent execution inspection."
        ],
        priority=80
    ),
    Rule(
        intent="internship_purpose",
        category="General / Project",
        exact_phrases=[
            "what is the internship purpose", "why build this for an internship",
            "internship project goals", "internship objective", "internship purpose"
        ],
        keywords=["internship purpose", "internship project", "internship goal"],
        patterns=[
            r"^what\s+is\s+the\s+internship\s+(purpose|goal|objective)$",
            r"^why\s+(was\s+this|is\s+this)\s+built\s+for\s+an\s+internship$"
        ],
        responses=[
            "This internship project demonstrates mastery of core software engineering fundamentals: modular Python architecture, RESTful API design with FastAPI, deterministic pattern matching, and full-stack integration.",
            "It showcases how modern AI systems can combine predictable rule engines with graceful fallback mechanisms in production environments."
        ],
        priority=80
    ),
    Rule(
        intent="rule_vs_ai",
        category="General / Project",
        exact_phrases=[
            "rule based vs ai", "rule vs ml", "difference between rule based and ai",
            "compare rules and ai", "rules vs machine learning", "rule vs ai"
        ],
        keywords=["rule based vs ai", "rule vs ai", "rules vs machine learning", "difference between rules and ai"],
        patterns=[
            r"^(what\s+is\s+the\s+)?difference\s+between\s+(rule\s+based|rules)\s+and\s+(ai|ml|machine\s+learning)$",
            r"^(rules?|rule\s+based)\s+vs\s+(ai|ml|machine\s+learning)$"
        ],
        responses=[
            "Rule-based systems use explicit if-then logic created by humans, offering 100% predictability and zero hallucinations. AI/ML models learn statistical patterns from data, offering flexibility on unstructured queries but requiring more computing power.",
            "Hybrid systems often pair fast deterministic rule engines for known common intents with AI models as an intelligent fallback layer."
        ],
        priority=80
    ),
    Rule(
        intent="fallback_explanation",
        category="General / Project",
        exact_phrases=[
            "what happens when no rule matches", "how does fallback work",
            "explain fallback", "what is fallback", "fallback explanation"
        ],
        keywords=["how does fallback work", "explain fallback", "fallback response", "what is fallback"],
        patterns=[
            r"^(what\s+is|explain|how\s+does)\s+(the\s+)?fallback(\s+work|\s+mechanism)?$",
            r"^what\s+happens\s+when\s+no\s+rule\s+matches$"
        ],
        responses=[
            "When a user's input does not satisfy any exact phrase, regex pattern, or keyword threshold, the engine gracefully triggers a fallback response (confidence 0.0) without crashing.",
            "Fallback ensures graceful degradation, acknowledging queries outside predefined rule boundaries and preparing for optional LLM fallback layers."
        ],
        priority=80
    ),
    Rule(
        intent="contact_help",
        category="General / Project",
        exact_phrases=[
            "how to contact support", "contact info", "contact help",
            "how to get help", "developer contact", "support contact"
        ],
        keywords=["contact support", "contact info", "developer contact", "support contact"],
        patterns=[
            r"^how\s+(to|can\s+i)\s+contact(\s+support|\s+help|\s+the\s+developer)?$",
            r"^contact\s+(info|support|help)$"
        ],
        responses=[
            "For assistance or feedback regarding this RuleBot educational project, please refer to the project repository and documentation links.",
            "You can reach out through the project's documentation channel or submit inquiries via the settings and feedback tab."
        ],
        priority=80
    ),
]

# Alias for backward compatibility
INITIAL_RULES = ALL_RULES
