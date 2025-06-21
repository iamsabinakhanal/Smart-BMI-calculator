from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import openai
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load BMI prediction model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'models', 'bmi_model.pkl')

try:
    model = joblib.load(model_path)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# Set OpenAI API key from environment
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY not set. Please check your .env file.")


@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    data = request.json
    features = [
        data.get('RIAGENDR'),
        data.get('RIDAGEYR'),
        data.get('BMXWT'),
        data.get('BMXHT'),
        data.get('RIDRETH1'),
        data.get('DMQADFC'),
        data.get('INDFMPIR')
    ]
    if any(f is None for f in features):
        return jsonify({'error': 'Missing input features'}), 400

    sample_input = np.array([features])
    try:
        predicted_bmi = model.predict(sample_input)[0]
    except Exception as e:
        return jsonify({'error': f"Model prediction failed: {e}"}), 500

    return jsonify({'predicted_bmi': round(float(predicted_bmi), 2)})


@app.route('/generate-plan', methods=['POST', 'OPTIONS'])
def generate_plan():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    data = request.json
    plan_type = data.get("type")  # 'nutrition' or 'fitness'
    age = data.get("age")
    bmi = data.get("bmi")
    lifestyle = data.get("lifestyle")

    if not all([plan_type, age, bmi]):
        return jsonify({"error": "Missing required fields"}), 400

    prompt = f"""
    You are a helpful and professional health assistant.
    Generate a detailed {plan_type} plan for a female aged {age}, with BMI {bmi}, and lifestyle level '{lifestyle}'.
    Give specific, practical and achievable suggestions for the next 4 weeks.
    Use a friendly and encouraging tone.
    """

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7,
        )
        plan_text = response.choices[0].message.content.strip()
        return jsonify({"plan": plan_text})
    except Exception as e:
        import traceback
        print("OpenAI ERROR:", str(e))
        traceback.print_exc()
        return jsonify({"error": f"OpenAI error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
