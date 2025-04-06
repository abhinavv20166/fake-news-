from flask import Flask, request, jsonify, render_template
import pickle
import re

# Load trained model
with open("fake_news_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

# Load TF-IDF Vectorizer
with open("tfidf_vectorizer.pkl", "rb") as vec_file:
    vectorizer = pickle.load(vec_file)

# Initialize Flask App
app = Flask(__name__)

# Function to clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(r'\W', ' ', text)  # Remove non-word characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text

@app.route('/')
def home():
    return render_template('index.html')  # Ensure you have an index.html file in a "templates" folder

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Handle JSON input
        if request.is_json:
            data = request.get_json()
            news_text = data.get("text", "").strip()
        else:
            news_text = request.form.get("text", "").strip()  # Support form-based input

        if not news_text:
            return jsonify({"error": "Please enter some text to analyze."}), 400

        # Clean and vectorize input text
        cleaned_text = clean_text(news_text)
        text_vector = vectorizer.transform([cleaned_text])

        # Make prediction
        prediction = model.predict(text_vector)[0]
        result = "REAL NEWS" if prediction == 1 else "FAKE NEWS"

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)  # Use host 0.0.0.0 for deployment
