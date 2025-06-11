import React from 'react';
import "../styles/NutriPlanSuggest.css"
import veg from "../assets/images/veg.png"
import vegan from "../assets/images/vegan.png"
import nonveg from "../assets/images/nonveg.png"
function NutriPlanSuggest() {
  return (
    <div>
      <h1>LET’S GET STARTED WITH YOUR NUTRITIONAL PLAN SUGGESTER</h1>
      <div className="subtitle">What’s your dietary preferences?</div>

      <div className="container">
        {/* Veg Card */}
        <div className="card">
          <img src={veg} alt="Veg" />
          <div className="label">Veg</div>
        </div>

        {/* Vegan Card */}
        <div className="card">
          <img src={vegan} alt="Vegan" />
          <div className="label">Vegan</div>
        </div>

        {/* Non Veg Card */}
        <div className="card">
          <img src={nonveg} alt="Non Veg" />
          <div className="label">non veg</div>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="allergies">Any allergies?</label>
          <br />
          <select id="allergies" name="allergies">
            <option value="">Select</option>
            <option value="none">None</option>
            <option value="nuts">Nuts</option>
            <option value="dairy">Dairy</option>
            <option value="gluten">Gluten</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="diseases">Any disease?</label>
          <br />
          <select id="diseases" name="diseases">
            <option value="">Select</option>
            <option value="none">None</option>
            <option value="diabetes">Diabetes</option>
            <option value="hypertension">Hypertension</option>
            <option value="heart">Heart Disease</option>
          </select>
        </div>
        <button className="button">PROCEED</button>
      </div>
    </div>
  );
}

export default NutriPlanSuggest;