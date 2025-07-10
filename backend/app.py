import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import joblib
import numpy as np
import random
# Load .env variables
load_dotenv()

app = Flask(_name_)
CORS(app)

# Load BMI prediction model
BASE_DIR = os.path.dirname(os.path.abspath(_file_))
model_path = os.path.join(BASE_DIR, 'models', 'bmi_model.pkl')

try:
    model = joblib.load(model_path)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

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


def fetch_exercises_by_categories(categories):
    exercise_results = []
    WGER_API = "https://wger.de/api/v2/exerciseinfo/"
    LANGUAGE = 2  # English
    STATUS = 2    # Only approved exercises
    for cat in categories:
        params = {
            "language": LANGUAGE,
            "status": STATUS,
            "category": cat,
            "limit": 100  # Increase limit to get more exercises per category
        }

        response = requests.get(WGER_API, params=params)
        response.raise_for_status()
        data = response.json()

        for item in data.get("results", []):
            # Extract English translation
            translation = next((t for t in item.get("translations", []) if t["language"] == LANGUAGE), None)

            if translation and translation.get("name") and translation.get("description"):
                description = translation["description"].replace("<p>", "").replace("</p>", "").strip()
                exercise_results.append({
                    "name": translation["name"],
                    "description": description,
                    "category": item["category"]["name"]
                })

    return exercise_results


@app.route('/generate-plan', methods=['POST', 'OPTIONS'])
def generate_plan():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    data = request.json
    plan_type = data.get("type")
    age = data.get("age")
    bmi = float(data.get("bmi"))
    lifestyle = data.get("lifestyle")
    income = int(data.get("income", 3))
    ethnicity = int(data.get("ethnicity", 3))

    if not all([plan_type, age, bmi]):
        return jsonify({"error": "Missing required fields"}), 400

    # PERSONALIZATION LOGIC
    def adjust_calories(bmi, lifestyle, income):
        base = 2000
        if bmi < 18.5:
            base += 500
        elif bmi > 30:
            base -= 400
        
        if lifestyle == "Very Active":
            base += 300
        elif lifestyle == "Sedentary":
            base -= 200

        if income <= 2:
            base -= 100  # simpler affordable diet
        elif income >= 5:
            base += 100  # nutrient-rich high-income options

        return max(1200, base)

    def personalize_categories(bmi, lifestyle, ethnicity):
        if bmi < 18.5:
            return [8, 9]  # strength + yoga
        elif bmi < 25:
            return [10, 8]  # cardio + strength
        elif bmi < 30:
            return [10, 14]  # cardio + plyo
        else:
            return [10, 15]  # cardio + stretching

    if plan_type == "nutrition":
        target_calories = adjust_calories(bmi, lifestyle, income)
        spoon_key = os.getenv("SPOONACULAR_API_KEY")

        try:
            res = requests.get("https://api.spoonacular.com/mealplanner/generate", params={
                "timeFrame": "week",
                "targetCalories": target_calories,
                "apiKey": spoon_key
            })
            res.raise_for_status()
            week_data = res.json().get("week", {})

            structured_meals = []
            for day, info in week_data.items():
                meals = info.get("meals", [])
                structured_meals.append({
                    "day": day.capitalize(),
                    "meals": [{
                        "title": meal["title"],
                        "readyInMinutes": meal["readyInMinutes"]
                    } for meal in meals]
                })

            return jsonify({"plan": structured_meals})

        except Exception as e:
            return jsonify({"error": f"Spoonacular error: {str(e)}"}), 500

    elif plan_type == "fitness":
        categories = personalize_categories(bmi, lifestyle, ethnicity)

        try:
            exercise_results = []
            
            exercises = fetch_exercises_by_categories(categories)
            if not exercises:
                return jsonify({"error": "No exercises found."}), 404

            # Shuffle to randomize selection
            random.shuffle(exercises)

            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            weekly_plan = []

            for i, day in enumerate(days):
                daily = [exercises[(i * 2 + j) % len(exercises)] for j in range(2)]
                weekly_plan.append({
                    "day": day,
                    "exercises": daily
                })



            return jsonify({"plan": weekly_plan})

        except Exception as e:
            return jsonify({"error": f"Wger error: {str(e)}"}), 500

    else:
        return jsonify({"error": "Invalid plan type"}), 400

if _name_ == '_main_':
    app.run(debug=True)