import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user and their plans?")) return;
    try {
      await axios.delete(`${API_BASE}/user/${id}`);
      fetchUsers();
      fetchPlans();
    } catch {
      alert("Failed to delete user");
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await axios.delete(`${API_BASE}/plan/${id}`);
      fetchPlans();
    } catch {
      alert("Failed to delete plan");
    }
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
      alert("Failed to update user");
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: 'auto', 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      backgroundColor: '#fafafa',
      minHeight: '100vh',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: '700', fontSize: '2.5rem', color: '#222' }}>
        Admin Dashboard
      </h1>

      {error && <p style={{ color: 'red', marginBottom: '1rem', fontWeight: '600' }}>{error}</p>}

      <section style={{ 
        marginBottom: '3rem', 
        backgroundColor: '#fff', 
        padding: '1.5rem 2rem', 
        borderRadius: '12px', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', 
        display: 'flex', 
        justifyContent: 'space-around', 
        fontSize: '1.3rem',
        fontWeight: '600',
        color: '#333'
      }}>
        {stats ? (
          <>
            <div>
              Total Users<br />
              <span style={{ fontSize: '2rem', color: '#0077cc' }}>{stats.totalUsers}</span>
            </div>
            <div>
              Average BMI<br />
              <span style={{ fontSize: '2rem', color: '#28a745' }}>{stats.averageBMI.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p>Loading stats...</p>
        )}
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#0077cc', fontWeight: '700', fontSize: '1.8rem' }}>Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <table
            border="0"
            cellPadding="12"
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#0077cc', color: 'white', fontSize: '1rem' }}>
                <th style={{ paddingLeft: '1.5rem', textAlign: 'left' }}>Name</th>
                <th>Age</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Ethnicity</th>
                <th>Activity Level</th>
                <th>Income Ratio</th>
                <th>BMI</th>
                <th style={{ paddingRight: '1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((u, i) => (
                <tr 
                  key={u._id} 
                  style={{ 
                    backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white', 
                    textAlign: 'center', 
                    fontSize: '1rem',
                    boxShadow: 'inset 0 -1px 0 #eee',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e6f0ff'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#f9f9f9' : 'white'}
                >
                  <td style={{ paddingLeft: '1.5rem', fontWeight: '600', textAlign: 'left' }}>{u.name}</td>
                  <td>{u.age}</td>
                  <td>{u.weight}</td>
                  <td>{u.height}</td>
                  <td>{ethnicityMap[u.ethnicity]}</td>
                  <td>{activityLevelMap[u.lifestyle]}</td>
                  <td>{incomeMap[u.income]}</td>
                  <td>{u.bmi}</td>
                  <td style={{ paddingRight: '1.5rem' }}>
                    <button
                      onClick={() => openEditModal(u)}
                      style={{
                        marginRight: '0.7rem',
                        padding: '6px 12px',
                        backgroundColor: '#0077cc',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#005fa3'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0077cc'}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(u._id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#e74c3c',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
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

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#28a745', fontWeight: '700', fontSize: '1.8rem' }}>Plans</h2>
        {loadingPlans ? (
          <p>Loading plans...</p>
        ) : (
          <table
            border="0"
            cellPadding="12"
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 15px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#28a745', color: 'white', fontSize: '1rem' }}>
                <th style={{ paddingLeft: '1.5rem', textAlign: 'left' }}>User Name</th>
                <th style={{ width: '40%' }}>Nutrition Plan</th>
                <th style={{ width: '40%' }}>Fitness Plan</th>
                <th>Generated At</th>
                <th style={{ paddingRight: '1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No plans found.
                  </td>
                </tr>
              )}
              {plans.map((p, i) => (
                <tr
                  key={p._id}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white',
                    verticalAlign: 'top',
                    fontSize: '0.95rem',
                    boxShadow: 'inset 0 -1px 0 #eee',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e6ffe6'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#f9f9f9' : 'white'}
                >
                  <td style={{ fontWeight: '600', paddingLeft: '1.5rem', textAlign: 'left' }}>
                    {p.userId?.name || "N/A"}
                  </td>

                  {/* Nutrition Plan */}
                  <td
                    style={{
                      maxHeight: '360px',
                      overflowY: 'auto',
                      padding: '12px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '8px',
                      lineHeight: '1.4',
                    }}
                  >
                    {p.nutritionPlan.map(day => (
                      <div key={day.day} style={{ marginBottom: '1.2rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#0077cc' }}>{day.day}</strong>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', color: '#333' }}>
                          {day.meals.map((meal, idx) => (
                            <li key={idx}>
                              {meal.title} <em style={{ color: '#555', fontSize: '0.85rem' }}>({meal.readyInMinutes} min)</em>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </td>

                  {/* Fitness Plan */}
                  <td
                    style={{
                      maxHeight: '360px',
                      overflowY: 'auto',
                      padding: '12px',
                      backgroundColor: '#fff8e1',
                      borderRadius: '8px',
                      lineHeight: '1.4',
                    }}
                  >
                    {p.fitnessPlan.map(day => (
                      <div key={day.day} style={{ marginBottom: '1.2rem' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#28a745' }}>{day.day}</strong>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', color: '#333' }}>
                          {day.exercises.map((ex, idx) => (
                            <li key={idx}>
                              <strong>{ex.name}</strong>: {ex.description.length > 120
                                ? ex.description.substring(0, 120) + '...'
                                : ex.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </td>

                  <td style={{ textAlign: 'center', fontWeight: '600' }}>
                    {new Date(p.generatedAt).toLocaleString()}
                  </td>

                  <td style={{ textAlign: 'center', paddingRight: '1.5rem' }}>
                    <button
                      onClick={() => deletePlan(p._id)}
                      style={{
                        padding: '7px 15px',
                        backgroundColor: '#e74c3c',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
                    >
                      Delete Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Edit User Modal */}
      {editingUser && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem 2.5rem',
              borderRadius: '15px',
              width: '450px',
              maxWidth: '95vw',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              fontSize: '1rem',
            }}
          >
            <h2 style={{ marginBottom: '1rem', color: '#0077cc', fontWeight: '700' }}>Edit User</h2>
            <form onSubmit={submitUserUpdate}>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600' }}>
                Name:
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600' }}>
                Age (years):
                <input
                  type="number"
                  name="age"
                  value={editFormData.age}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600' }}>
                Weight (kg):
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={editFormData.weight}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600' }}>
                Height (cm):
                <input
                  type="number"
                  name="height"
                  value={editFormData.height}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600' }}>
                Ethnicity:
                <select
                  name="ethnicity"
                  value={editFormData.ethnicity}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                >
                  {Object.entries(ethnicityMap).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600' }}>
                Activity Level:
                <select
                  name="activityLevel"
                  value={editFormData.activityLevel}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                >
                  {Object.entries(activityLevelMap).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600' }}>
                Income Ratio:
                <select
                  name="income"
                  value={editFormData.income}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                >
                  {Object.entries(incomeMap).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'block', marginBottom: '1.2rem', fontWeight: '600' }}>
                BMI Result:
                <input
                  type="number"
                  step="0.1"
                  name="bmi"
                  value={editFormData.bmi}
                  onChange={handleEditChange}
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                  }}
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    backgroundColor: '#0077cc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#005fa3'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0077cc'}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    padding: '10px 22px',
                    backgroundColor: '#ccc',
                    color: '#444',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#999'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ccc'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
