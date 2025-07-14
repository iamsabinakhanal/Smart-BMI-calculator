import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const ethnicityMap = {
  1: "Mexican American",
  2: "Other Hispanic",
  3: "Non-Hispanic White",
  4: "Non-Hispanic Black",
  5: "Other Race",
};

const activityLevelMap = {
  1: "Sedentary",
  2: "Lightly Active",
  3: "Moderately Active",
  4: "Very Active",
  5: "Extremely Active",
};

const incomeMap = {
  1: "< 1.0",
  2: "1.0-1.99",
  3: "2.0-3.99",
  4: "4.0-5.99",
  5: "6.0+",
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    bmi: '',
    activityLevel: '',
    income: '',
    ethnicity: ''
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  const API_BASE = "http://localhost:8000/admin";

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const res = await axios.get(`${API_BASE}/plans`);
      setPlans(res.data);
    } catch (err) {
      setError("Failed to fetch plans");
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`);
      setStats(res.data);
    } catch (err) {
      setError("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
    fetchStats();
  }, []);

  const showConfirmation = (title, message, onConfirm, onCancel = () => setShowConfirmDialog(false)) => {
    setDialogConfig({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setShowConfirmDialog(false);
      },
      onCancel
    });
    setShowConfirmDialog(true);
  };

  const deleteUser = async (id) => {
    showConfirmation(
      "Delete User",
      "Are you sure you want to delete this user and all their plans?",
      async () => {
        try {
          await axios.delete(`${API_BASE}/user/${id}`);
          fetchUsers();
          fetchPlans();
        } catch {
          showConfirmation(
            "Error",
            "Failed to delete user. Please try again.",
            () => {}
          );
        }
      }
    );
  };

  const deletePlan = async (id) => {
    showConfirmation(
      "Delete Plan",
      "Are you sure you want to delete this plan?",
      async () => {
        try {
          await axios.delete(`${API_BASE}/plan/${id}`);
          fetchPlans();
        } catch {
          showConfirmation(
            "Error",
            "Failed to delete plan. Please try again.",
            () => {}
          );
        }
      }
    );
  };

  const openEditModal = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name || '',
      age: user.age || '',
      weight: user.weight || '',
      height: user.height || '',
      bmi: user.bmi || '',
      activityLevel: user.lifestyle || '',
      income: user.income || '',
      ethnicity: user.ethnicity || ''
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setEditFormData({
      name: '',
      age: '',
      weight: '',
      height: '',
      bmi: '',
      activityLevel: '',
      income: '',
      ethnicity: ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitUserUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/user/${editingUser}`, {
        ...editFormData,
        age: Number(editFormData.age),
        weight: Number(editFormData.weight),
        height: Number(editFormData.height),
        bmi: Number(editFormData.bmi),
        lifestyle: Number(editFormData.activityLevel),
        income: Number(editFormData.income),
        ethnicity: Number(editFormData.ethnicity),
      });
      closeEditModal();
      fetchUsers();
    } catch {
      showConfirmation(
        "Error",
        "Failed to update user. Please try again.",
        () => {}
      );
    }
  };

  const openPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setShowPlanDetails(true);
  };

  const closePlanDetails = () => {
    setSelectedPlan(null);
    setShowPlanDetails(false);
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-header">Admin Dashboard</h1>

      {error && <p className="error-message">{error}</p>}

      <section className="stats-container">
        {stats ? (
          <>
            <div className="stat-item">
              Total Users<br />
              <span className="stat-value">{stats.totalUsers}</span>
            </div>
            <div className="stat-item">
              Average BMI<br />
              <span className="stat-value green">{stats.averageBMI.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p>Loading stats...</p>
        )}
      </section>

      <section>
        <h2 className="section-header blue">Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr className="table-header">
                <th>Name</th>
                <th>Age</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Ethnicity</th>
                <th>Activity Level</th>
                <th>Income Ratio</th>
                <th>BMI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="9" className="empty-state">No users found.</td>
                </tr>
              )}
              {users.map((u, i) => (
                <tr key={u._id} className="table-row">
                  <td className="table-cell-left">{u.name}</td>
                  <td className="table-cell">{u.age}</td>
                  <td className="table-cell">{u.weight}</td>
                  <td className="table-cell">{u.height}</td>
                  <td className="table-cell">{ethnicityMap[u.ethnicity]}</td>
                  <td className="table-cell">{activityLevelMap[u.lifestyle]}</td>
                  <td className="table-cell">{incomeMap[u.income]}</td>
                  <td className="table-cell">{u.bmi}</td>
                  <td className="table-cell">
                    <button
                      onClick={() => openEditModal(u)}
                      className="btn btn-primary"
                      style={{ marginRight: '0.7rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="section-header blue">Nutrition & Fitness Plans</h2>
        {loadingPlans ? (
          <p>Loading plans...</p>
        ) : (
          <table className="plans-table">
            <thead>
              <tr className="plans-header">
                <th>User</th>
                <th>Nutrition Plan</th>
                <th>Fitness Plan</th>
                <th>Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">No plans found.</td>
                </tr>
              )}
              {plans.map((p) => (
                <tr key={p._id} className="plan-row">
                  <td className="plan-cell-left">
                    <div className="plan-user-name">
                      {p.userId?.name || "N/A"}
                    </div>
                  </td>

                  <td className="plan-cell">
                    <div className="plan-container nutrition-plan">
                      {p.nutritionPlan.slice(0, 2).map(day => (
                        <div key={day.day} className="day-plan">
                          <div className="day-title">{day.day}</div>
                          <ul className="plan-list">
                            {day.meals.slice(0, 2).map((meal, idx) => (
                              <li key={idx}>
                                <div className="meal-info">
                                  <span className="meal-name">{meal.title}</span>
                                  <span className="meal-time">{meal.readyInMinutes} min</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <button 
                        onClick={() => openPlanDetails(p)}
                        className="btn btn-primary"
                        style={{ marginTop: '10px' }}
                      >
                        View Full Plan
                      </button>
                    </div>
                  </td>

                  <td className="plan-cell">
                    <div className="plan-container fitness-plan">
                      {p.fitnessPlan.slice(0, 2).map(day => (
                        <div key={day.day} className="day-plan">
                          <div className="day-title">{day.day}</div>
                          <ul className="plan-list">
                            {day.exercises.slice(0, 2).map((ex, idx) => (
                              <li key={idx}>
                                <div className="exercise-info">
                                  <div className="exercise-name">{ex.name}</div>
                                  <div className="exercise-desc">
                                    {ex.description.substring(0, 80)}...
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <button 
                        onClick={() => openPlanDetails(p)}
                        className="btn btn-primary"
                        style={{ marginTop: '10px' }}
                      >
                        View Full Plan
                      </button>
                    </div>
                  </td>

                  <td className="plan-cell">
                    <div className="generated-time">
                      {new Date(p.generatedAt).toLocaleDateString()}
                      <br />
                      {new Date(p.generatedAt).toLocaleTimeString()}
                    </div>
                  </td>

                  <td className="plan-cell">
                    <button
                      onClick={() => deletePlan(p._id)}
                      className="btn btn-danger btn-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

{editingUser && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-header">Edit User</h2>
      <form onSubmit={submitUserUpdate}>
        <div className="modal-body">
          <label className="form-label">
            Name:
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              required
              className="form-input"
            />
          </label>

          <label className="form-label">
            Age (years):
            <input
              type="number"
              name="age"
              value={editFormData.age}
              onChange={handleEditChange}
              required
              className="form-input"
            />
          </label>

          <label className="form-label">
            Weight (kg):
            <input
              type="number"
              step="0.1"
              name="weight"
              value={editFormData.weight}
              onChange={handleEditChange}
              required
              className="form-input"
            />
          </label>

          <label className="form-label">
            Height (cm):
            <input
              type="number"
              name="height"
              value={editFormData.height}
              onChange={handleEditChange}
              required
              className="form-input"
            />
          </label>

          <label className="form-label">
            Ethnicity:
            <select
              name="ethnicity"
              value={editFormData.ethnicity}
              onChange={handleEditChange}
              required
              className="form-select"
            >
              {Object.entries(ethnicityMap).map(([key, val]) => (
                <option key={key} value={key}>{val}</option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Activity Level:
            <select
              name="activityLevel"
              value={editFormData.activityLevel}
              onChange={handleEditChange}
              required
              className="form-select"
            >
              {Object.entries(activityLevelMap).map(([key, val]) => (
                <option key={key} value={key}>{val}</option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Income Ratio:
            <select
              name="income"
              value={editFormData.income}
              onChange={handleEditChange}
              required
              className="form-select"
            >
              {Object.entries(incomeMap).map(([key, val]) => (
                <option key={key} value={key}>{val}</option>
              ))}
            </select>
          </label>

          <label className="form-label">
            BMI Result:
            <input
              type="number"
              step="0.1"
              name="bmi"
              value={editFormData.bmi}
              onChange={handleEditChange}
              required
              className="form-input"
            />
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={closeEditModal}
            className="btn btn-secondary btn-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="confirmation-dialog">
            <h3 className="dialog-title">{dialogConfig.title}</h3>
            <p className="dialog-message">{dialogConfig.message}</p>
            <div className="dialog-actions">
              <button
                onClick={dialogConfig.onCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={dialogConfig.onConfirm}
                className="btn btn-danger"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanDetails && selectedPlan && (
        <div className="modal-overlay">
          <div className="plan-details-modal">
            <div className="plan-details-header">
              <h2 className="plan-details-title">
                Plan for {selectedPlan.userId?.name || "User"}
              </h2>
              <button 
                onClick={closePlanDetails}
                className="plan-details-close"
              >
                &times;
              </button>
            </div>
            
            <div className="plan-details-content">
              <div className="plan-details-column">
                <div className="plan-details-section">
                  <h3 className="plan-details-section-title">Nutrition Plan</h3>
                  {selectedPlan.nutritionPlan.map(day => (
                    <div key={day.day} className="plan-details-day">
                      <h4 className="plan-details-day-title">{day.day}</h4>
                      <ul className="plan-list">
                        {day.meals.map((meal, idx) => (
                          <li key={idx}>
                            <div className="meal-info">
                              <span className="meal-name">{meal.title}</span>
                              <span className="meal-time">{meal.readyInMinutes} min</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="plan-details-column">
                <div className="plan-details-section">
                  <h3 className="plan-details-section-title">Fitness Plan</h3>
                  {selectedPlan.fitnessPlan.map(day => (
                    <div key={day.day} className="plan-details-day">
                      <h4 className="plan-details-day-title">{day.day}</h4>
                      <ul className="plan-list">
                        {day.exercises.map((ex, idx) => (
                          <li key={idx}>
                            <div className="exercise-info">
                              <div className="exercise-name">{ex.name}</div>
                              <div className="exercise-desc">{ex.description}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}