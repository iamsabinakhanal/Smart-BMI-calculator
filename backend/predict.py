import os
import joblib
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, 'bmi_model.pkl')

# Load the model
model = joblib.load(model_path)

# Example input with 7 features:
# RIAGENDR (Gender: e.g., 1=Male, 2=Female)
# RIDAGEYR (Age)
# BMXWT (Weight in kg)
# BMXHT (Height in cm)
# RIDRETH1 (Ethnicity)
# DMQADFC (Lifestyle)
# INDFMPIR (Income)
sample_input = np.array([[1, 25, 65, 170, 3, 2, 4]])

predicted_bmi = model.predict(sample_input)

print(f"Predicted BMI for input {sample_input.tolist()} is: {predicted_bmi[0]:.2f}")
