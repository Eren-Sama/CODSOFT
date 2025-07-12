from flask import Flask, render_template, request, jsonify
from VeltriX import get_response  # Make sure this file exists with the function

app = Flask(__name__)

# Home route – renders the HTML UI
@app.route("/")
def index():
    return render_template("index.html")

# Chat endpoint – handles user messages
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"response": "I didn't receive any input."})
    
    response = get_response(user_input)
    return jsonify({"response": response})

# App entry point
if __name__ == "__main__":
    print("VeltriX is running at http://localhost:5000")
    app.run(debug=True)
