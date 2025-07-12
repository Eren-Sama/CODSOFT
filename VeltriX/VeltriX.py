import spacy
import re
import requests
import unicodedata
from datetime import datetime
import random

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    print(f"Error loading spaCy model: {e}")
    # Fallback to a simple tokenizer if spaCy model isn't available
    class SimpleNLP:
        def __call__(self, text):
            return SimpleDoc(text)
    
    class SimpleDoc:
        def __init__(self, text):
            self.text = text
            self.ents = []
    
    nlp = SimpleNLP()

# Constants
OPENWEATHER_API_KEY = "bdf9d40c08e95771e35e688eb15e3bc6"
DEFAULT_CITY = "Delhi"

# Response templates
INTENT_RESPONSES = {
    "greeting": "Hello! How can I assist you today?",
    "farewell": "Goodbye! Have a great day.",
    "identity": "I'm VeltriX — an NLP-powered assistant here to help.",
    "creator": "My creator? That's Eklavya - AI enthusiast and all-around brainiac.",
    "help": "You can ask me about time, date, weather, jokes, quotes, calculations, multiplication tables, etc. Type 'clear' to reset our conversation.",
    "thanks": "You're welcome!",
    "location": "I'm running on a cloud server!",
    "language": "I understand English for now.",
    "skills": "I can provide weather updates, time, date, jokes, quotes, calculations, multiplication tables, and more!",
    "feedback": "Thanks! Your feedback is valuable.",
    "clear": "I've cleared our conversation history.",
    "default": "Sorry, I didn't understand that. Try rephrasing."
}

THANKS_RESPONSES = [
    "You're welcome! Glad I could help.",
    "Happy to be of service!",
    "Anytime! Need anything else?",
    "My pleasure. That's what I'm here for!",
    "Glad I could assist you today.",
    "No problem at all!",
    "You're most welcome!",
    "It's my pleasure to help.",
    "Glad that was useful for you!",
    "You got it! Anything else you'd like to know?"
]

CONTEXT_RESPONSES = {
    "joke": [
        "Glad I could make you laugh!",
        "Happy to brighten your day with a joke!",
        "I've got plenty more where that came from!",
        "Nothing better than sharing a laugh, right?",
        "Comedy is my specialty!"
    ],
    "motivation": [
        "Stay motivated! There's always a reason to keep going.",
        "Glad that resonated with you! Keep pushing forward.",
        "Inspiration is everywhere if we look for it!",
        "I'm here whenever you need a motivational boost!",
        "That's the spirit! Keep that positive energy flowing."
    ],
    "weather": [
        "Weather information is always handy, isn't it?",
        "Glad I could help with the forecast!",
        "Always good to be prepared for the weather!",
        "I'm here for all your weather updates!"
    ],
    "ask_time": [
        "Time flies, doesn't it?",
        "Keeping track of time is important!",
        "Glad to be your timekeeper!"
    ],
    "ask_date": [
        "Keeping track of dates is what I do!",
        "Always good to know what day it is!",
        "Calendar at your service!"
    ],
    "calculation": [
        "Math is my strong suit!",
        "I love crunching numbers!",
        "Need any other calculations?",
        "Numbers are my friends!"
    ],
    "multiplication_table": [
        "Tables are fun to learn, aren't they?",
        "Mathematics is beautiful!",
        "Need another table? Just ask!",
        "I can help with any multiplication table you need!",
        "Math practice makes perfect!"
    ],
    "skills": [
        "I'm always learning new skills to help you better!",
        "Just scratching the surface of what I can do!",
        "I'm here to assist with all these capabilities and more!"
    ],
    "identity": [
        "Nice to meet you properly!",
        "That's me! Your friendly assistant.",
        "At your service, anytime!"
    ]
}

# Regular expression patterns to identify user intent
INTENT_PATTERNS = {
    "greeting": [r"\b(hi|hello|hey|good morning|good evening|greetings)\b"],
    "farewell": [r"\b(bye|goodbye|exit|see you|see ya|quit|later)\b"],
    "ask_time": [r"\b(what.?s the time|current time|tell me the time|time now|what time is it|time right now|what.?s time|whats time|what.s time)\b"],
    "ask_date": [r"\b(today.?s date|what.?date|current date|which day|what day is it today)\b"],
    "identity": [r"\b(who are you|what.?s your name|identify yourself|your name please|what is your name)\b"],
    "creator": [r"\b(who created you|who made you|your creator|your developer|built you|who is your developer)\b"],
    "help": [r"\b(help|assist|what can you do|how can you help|commands)\b"],
    "thanks": [r"\b(thank you|thanks|thx|appreciate|cheers|nice|great|cool|good job|awesome|well done|nice one|good one|love it|brilliant|excellent|perfect|wow|amazing|that\'s hilarious|that\'s inspiring|that\'s great|that\'s awesome|that\'s cool|that is hilarious|that is inspiring|that is awesome|that is cool|hilarious|inspiring)\b"],
    "joke": [r"\b(joke|make me laugh|tell me something funny|say something funny|tell me funny|funny joke|humor|humour)\b"],
    "motivation": [r"\b(motivate me|motivation|inspire me|feeling low|quote|quotes|tell me a quote|need inspiration|say something wise)\b"],
    "location": [r"\b(where are you from|your location|where.*running)\b"],    
    "language": [r"\b(what language.*speak|which language|languages you know)\b"],
    "skills": [r"\b(skill|skills|can you do|features|your abilities|how can you help|functions|what you offer|your capabilities)\b"],
    "feedback": [r"\b(feedback|report|issue|problem|bug)\b"],
    "weather": [r"\b(weather|temperature|forecast|climate|hot|cold|is it raining|how.?s the weather|weather in [a-zA-Z]+|[a-zA-Z]+ weather|what is the temperature|temperature at|temperature in)\b"],
    "calculation": [r"(\d+\s*[\+\-\*\/x]\s*\d+(?:\s*[\+\-\*\/x]\s*\d+)*)|calculate|calculator|compute|math|arithmetic|solve|equation|what\s+is\s+\d+[\+\-\*\/x]|what\s+is\s+\d+\s*(?:plus|minus|times|divided by|multiply by|subtract|add to|multiplied by)\s*\d+|(?:plus|minus|times|divided by|multiply by|subtract|add to|multiplied by)|what\'s\s+\d+|(\d+\.?\d*\s*\-\s*\d+\.?\d*%)|(\d+\.?\d*%\s*of\s*\d+\.?\d*)|what\s+is\s+\d+\.?\d*%\s+of|what\'s\s+\d+\.?\d*%\s+of"],
    "clear": [r"\b(clear|clear screen|clear chat|reset|start over|clean up|refresh)\b"],
    "multiplication_table": [r"\b(table of \d+|multiplication table for \d+|times table for \d+|show me the \d+ times table|what is the table of \d+|show \d+ table)\b"]
}

last_intent = None

def normalize_text(text):
    """Normalize text by handling unicode characters and standardizing quotes"""
    text = unicodedata.normalize("NFKD", text)
    text = text.replace("'", "'").replace("'", "'").replace(""", '"').replace(""", '"')
    return text

def preprocess(text):
    """Preprocess the user input for intent detection"""
    text = normalize_text(text)
    text = text.replace("that's", "thats").replace("it's", "its").replace("what's", "whats")
    return text.lower()

def detect_intent(text):
    """Detect the user's intent from their input"""
    # Special case for percentage patterns
    percentage_of_pattern = r'(what is|what\'s|calculate|compute)\s+(\d+\.?\d*)%\s+of\s+(\d+\.?\d*)'
    percentage_of_match = re.search(percentage_of_pattern, text, re.IGNORECASE)
    if percentage_of_match:
        return "calculation"
    
    # First check against regular patterns
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return intent
    
    # Special case: If a single city name is entered, consider it a weather query
    words = text.split()
    if len(words) == 1 and len(words[0]) >= 3 and words[0].isalpha():
        common_words = ["hello", "hi", "hey", "bye", "goodbye", "help", "thanks", "joke", "quote"]
        if words[0].lower() not in common_words:
            return "weather"
            
    return "default"

def get_weather_from_input(user_input):
    """Extract location from user input and fetch weather data"""
    doc = nlp(user_input)
    city = None
    
    # First try to extract location using NLP entity recognition
    for ent in doc.ents:
        if hasattr(ent, 'label_') and ent.label_ == "GPE":
            city = ent.text
            break
    
    # If no city found, try using regex patterns
    if not city:
        # Extract location from patterns like "weather in [city]" or "[city] weather"
        patterns = [
            r"weather in ([a-zA-Z ]+)",
            r"temperature in ([a-zA-Z ]+)",
            r"weather (?:for|of) ([a-zA-Z ]+)",
            r"temperature (?:for|of) ([a-zA-Z ]+)",
            r"weather.*?([a-zA-Z ]{3,})",
            r"([a-zA-Z ]{3,})\s+weather",
            r"([a-zA-Z ]{3,})\s+temperature",
            r"(?:at|in) ([a-zA-Z ]{3,})"
        ]
        
        for pattern in patterns:
            match = re.search(pattern, user_input, re.IGNORECASE)
            if match:
                potential_city = match.group(1).strip()
                common_words = ["the", "weather", "temperature", "climate", "like", "going", "current", "what", "is"]
                if potential_city.lower() not in common_words and len(potential_city) > 2:
                    city = potential_city
                    break
    
    # As a last resort, just look for words with 3+ characters that aren't common weather words
    if not city:
        words = user_input.split()
        common_words = ["weather", "temperature", "forecast", "climate", "what", "is", "the", "current", "now", "today", "like", "going", "tell", "me", "about", "check", "know", "how", "get", "give", "show", "whats", "at", "in", "of", "for"]
        
        for word in words:
            word = re.sub(r'[^\w\s]', '', word).strip()  # Remove punctuation
            if len(word) >= 3 and word.lower() not in common_words and word.isalpha():
                city = word
                break
                    
    if not city:
        city = DEFAULT_CITY
    
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        data = requests.get(url).json()
        if data.get("main"):
            temp = data["main"]["temp"]
            desc = data["weather"][0]["description"]
            return f"The current temperature in {city} is {temp}°C with {desc}."
        elif data.get("message"):
            return f"Could not retrieve weather: {data['message'].capitalize()}."
        else:
            return f"Sorry, I couldn't get weather for {city}."
    except Exception as e:
        print("Weather API error:", e)
        return "Weather service is currently unavailable."

def get_joke():
    """Fetch a random joke from the joke API"""
    try:
        res = requests.get("https://official-joke-api.appspot.com/random_joke").json()
        return f"{res['setup']} {res['punchline']}"
    except Exception as e:
        print("Joke API error:", e)
        return "Couldn't find a joke right now."

def get_quote():
    """Fetch a random motivational quote from the quote API"""
    try:
        res = requests.get("https://zenquotes.io/api/random").json()
        return f"{res[0]['q']} — {res[0]['a']}"
    except Exception as e:
        print("Quote API error:", e)
        return "No quotes available right now."

def generate_multiplication_table(user_input):
    """Generate a multiplication table for a number extracted from the user input"""
    number_match = re.search(r'\d+', user_input)
    
    if not number_match:
        return "I couldn't find a number for the multiplication table. Please specify a number like '7'."
    
    number = int(number_match.group())
    
    table_lines = [f"Multiplication Table for {number}:"]
    table_lines.append("─" * 30)
    
    for i in range(1, 11):
        result = number * i
        table_lines.append(f"{number} × {i} = {result}")
    
    table_lines.append("─" * 30)
    
    return "\n".join(table_lines)

def extract_calculation(text):
    """Extract and solve mathematical calculations from text"""
    # Special case for "What is X% of Y" pattern
    percentage_of_pattern = r'(what is|what\'s|calculate|compute)\s+(\d+\.?\d*)%\s+of\s+(\d+\.?\d*)'
    percentage_of_match = re.search(percentage_of_pattern, text, re.IGNORECASE)
    if percentage_of_match:
        try:
            percent = float(percentage_of_match.group(2))
            base = float(percentage_of_match.group(3))
            result = base * percent / 100
            if result == int(result):
                return f"The answer is {int(result)}."
            else:
                return f"The answer is {result}."
        except Exception as e:
            print(f"Percentage of calculation error: {e}")
    
    # Replace 'x' with '*' for multiplication
    text = text.replace(' x ', ' * ').replace('x', '*')
    
    # Handle percentage calculations
    percentage_pattern = r'(\d+\.?\d*)\s*\-\s*(\d+\.?\d*)%'
    percentage_match = re.search(percentage_pattern, text)
    if percentage_match:
        try:
            base = float(percentage_match.group(1))
            percent = float(percentage_match.group(2))
            result = base - (base * percent / 100)
            if result == int(result):
                return f"The answer is {int(result)}."
            else:
                return f"The answer is {result}."
        except Exception as e:
            print(f"Percentage calculation error: {e}")
    
    # Handle percentage of value calculations
    of_percentage_pattern = r'(\d+\.?\d*)%\s*of\s*(\d+\.?\d*)'
    of_percentage_match = re.search(of_percentage_pattern, text, re.IGNORECASE)
    if of_percentage_match:
        try:
            percent = float(of_percentage_match.group(1))
            base = float(of_percentage_match.group(2))
            result = base * percent / 100
            if result == int(result):
                return f"The answer is {int(result)}."
            else:
                return f"The answer is {result}."
        except Exception as e:
            print(f"Percentage calculation error: {e}")
    
    # Basic pattern for mathematical expressions
    basic_pattern = r'(\d+\.?\d*\s*[\+\-\*\/]\s*\d+\.?\d*(?:\s*[\+\-\*\/]\s*\d+\.?\d*)*)'
    match = re.search(basic_pattern, text)
    
    if match:
        expr = match.group(1)
        expr = expr.replace(' ', '')
        try:
            expr = expr.replace('--', '+')
            
            terms = []
            operators = []
            current_term = ""
            
            i = 0
            while i < len(expr):
                if expr[i] in "+-" and i > 0 and expr[i-1] not in "*/+-":
                    terms.append(current_term)
                    operators.append(expr[i])
                    current_term = ""
                else:
                    current_term += expr[i]
                i += 1
            
            if current_term:
                terms.append(current_term)
            
            term_values = []
            for term in terms:
                if '*' in term or '/' in term:
                    factors = []
                    factor_ops = []
                    
                    num_pattern = r'[+\-]?\d+\.?\d*'
                    factors = re.findall(num_pattern, term)
                    factor_ops = re.findall(r'[\*\/]', term)
                    
                    factors = [float(f) for f in factors]
                    term_value = factors[0]
                    for i in range(len(factor_ops)):
                        if factor_ops[i] == '*':
                            term_value *= factors[i+1]
                        elif factor_ops[i] == '/':
                            if factors[i+1] == 0:
                                return "Division by zero is not allowed."
                            term_value /= factors[i+1]
                    term_values.append(term_value)
                else:
                    term_values.append(float(term))
            
            result = term_values[0]
            for i in range(len(operators)):
                if operators[i] == '+':
                    result += term_values[i+1]
                elif operators[i] == '-':
                    result -= term_values[i+1]
            
            if result == int(result):
                return f"The answer is {int(result)}."
            else:
                return f"The answer is {result}."
        except Exception as e:
            print(f"Calculation error: {e}")
            return "I had trouble calculating that. Try a simpler expression."
    
    calc_patterns = [
        r'calculate\s+(.+)',
        r'compute\s+(.+)',
        r'what\s+is\s+(.+)',
        r'what\'s\s+(.+)',
        r'solve\s+(.+)'
    ]
    
    for pattern in calc_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            expr_text = match.group(1).strip()
            expr_match = re.search(r'(\d+\s*[\+\-\*\/]\s*\d+(?:\s*[\+\-\*\/]\s*\d+)*)', expr_text)
            if expr_match:
                return extract_calculation(expr_match.group(0))
            
            # Check for natural language calculations
            numbers = re.findall(r'\d+\.?\d*', expr_text)
            
            # Check for division with "divided by"
            div_match = re.search(r'(\d+\.?\d*)\s+divided\s+by\s+(\d+\.?\d*)', expr_text, re.IGNORECASE)
            if div_match and len(div_match.groups()) == 2:
                try:
                    n1 = float(div_match.group(1))
                    n2 = float(div_match.group(2))
                    if n2 == 0:
                        return "Division by zero is not allowed."
                    result = n1 / n2
                    if result == int(result):
                        return f"The answer is {int(result)}."
                    else:
                        return f"The answer is {result}."
                except Exception as e:
                    print(f"Calculation error: {e}")
                    return "I had trouble with that calculation."
            
            # Process other natural language calculations
            if len(numbers) >= 2:
                try:
                    if "+" in expr_text or "plus" in expr_text.lower() or "add" in expr_text.lower():
                        result = float(numbers[0]) + float(numbers[1])
                    elif "-" in expr_text or "minus" in expr_text.lower() or "subtract" in expr_text.lower():
                        result = float(numbers[0]) - float(numbers[1])
                    elif "*" in expr_text or "times" in expr_text.lower() or "multiply" in expr_text.lower():
                        result = float(numbers[0]) * float(numbers[1])
                    elif "/" in expr_text or "divided" in expr_text.lower() or "division" in expr_text.lower():
                        if float(numbers[1]) == 0:
                            return "Division by zero is not allowed."
                        result = float(numbers[0]) / float(numbers[1])
                    else:
                        return "I'm not sure how to calculate that."
                    
                    if result == int(result):
                        return f"The answer is {int(result)}."
                    else:
                        return f"The answer is {result}."
                except Exception as e:
                    print(f"Calculation error: {e}")
                    return "I had trouble with that calculation."
    
    # Handle calculations with word numbers (one, two, three, etc.)
    number_words = {
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
        'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
        'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70,
        'eighty': 80, 'ninety': 90, 'hundred': 100, 'thousand': 1000
    }
    
    word_calc_pattern = r'(what is|what\'s|calculate|compute|solve)\s+([a-z]+)\s+(plus|minus|times|multiplied by|divided by)\s+([a-z]+)'
    word_calc_match = re.search(word_calc_pattern, text.lower())
    
    if word_calc_match:
        try:
            num1_word = word_calc_match.group(2)
            operation = word_calc_match.group(3)
            num2_word = word_calc_match.group(4)
            
            if num1_word in number_words and num2_word in number_words:
                num1 = number_words[num1_word]
                num2 = number_words[num2_word]
                
                if operation == 'plus':
                    result = num1 + num2
                elif operation == 'minus':
                    result = num1 - num2
                elif operation in ['times', 'multiplied by']:
                    result = num1 * num2
                elif operation == 'divided by':
                    if num2 == 0:
                        return "Division by zero is not allowed."
                    result = num1 / num2
                
                if result == int(result):
                    return f"The answer is {int(result)}."
                else:
                    return f"The answer is {result}."
        except Exception as e:
            print(f"Word number calculation error: {e}")
    
    return "I couldn't find a mathematical expression to calculate. Try using a format like '5+3' or 'calculate 10 divided by 2'."

def get_response(user_input):
    """Generate a response based on the user's input"""
    global last_intent
    
    cleaned = preprocess(user_input)
    intent = detect_intent(cleaned)
    response = ""

    # Handle context-aware responses
    if intent == "thanks" and last_intent is not None and last_intent != "thanks":
        if last_intent in CONTEXT_RESPONSES:
            response = random.choice(CONTEXT_RESPONSES[last_intent])
        else:
            response = random.choice(THANKS_RESPONSES)
    elif intent == "ask_time":
        response = f"The current time is {datetime.now().strftime('%I:%M %p')}."
    elif intent == "ask_date":
        response = f"Today's date is {datetime.now().strftime('%A, %B %d, %Y')}."
    elif intent == "weather":
        response = get_weather_from_input(user_input)
    elif intent == "joke":
        response = get_joke()
    elif intent == "motivation":
        response = get_quote()
    elif intent == "calculation":
        response = extract_calculation(user_input)
    elif intent == "multiplication_table":
        response = generate_multiplication_table(user_input)
    elif intent == "clear":
        response = "CLEAR_CHAT_HISTORY"
    elif intent in INTENT_RESPONSES:
        response = INTENT_RESPONSES[intent]
    else:
        response = INTENT_RESPONSES["default"]

    if intent != "thanks":
        last_intent = intent
        
    return response
    
if __name__ == "__main__":
