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

  // Fetch users
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

  // Fetch plans
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

  // Fetch stats
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

  // Delete user
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

  // Delete plan
  const deletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await axios.delete(`${API_BASE}/plan/${id}`);
      fetchPlans();
    } catch {
      alert("Failed to delete plan");
    }
  };

  // Open edit modal with user data
  const openEditModal = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name || '',
      age: user.age || '',
      weight: user.weight || '',
      height: user.height || '',
      bmi: user.bmi || '',
      activityLevel: user.lifestyle || '',  // backend stores as lifestyle
      income: user.income || '',
      ethnicity: user.ethnicity || ''
    });
  };

  // Close edit modal
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

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit updated user
  const submitUserUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/user/${editingUser}`, {
        ...editFormData,
        age: Number(editFormData.age),
        weight: Number(editFormData.weight),
        height: Number(editFormData.height),
        bmi: Number(editFormData.bmi),
        lifestyle: Number(editFormData.activityLevel),  // map back to lifestyle field
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
    <div style={{ padding: '1rem', maxWidth: '1100px', margin: 'auto' }}>
      <h1>Admin Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section style={{ marginBottom: '2rem' }}>
        <h2>Stats</h2>
        {stats ? (
          <div>
            <p><strong>Total Users:</strong> {stats.totalUsers}</p>
            <p><strong>Average BMI:</strong> {stats.averageBMI.toFixed(2)}</p>
          </div>
        ) : <p>Loading stats...</p>}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Users</h2>
        {loadingUsers ? <p>Loading users...</p> : (
          <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age (years)</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Ethnicity</th>
                <th>Activity Level</th>
                <th>Income Ratio</th>
                <th>BMI Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && <tr><td colSpan="9">No users found.</td></tr>}
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.age}</td>
                  <td>{u.weight}</td>
                  <td>{u.height}</td>
                  <td>{ethnicityMap[u.ethnicity]}</td>
                  <td>{activityLevelMap[u.lifestyle]}</td>
                  <td>{incomeMap[u.income]}</td>
                  <td>{u.bmi}</td>
                  <td>
                    <button onClick={() => openEditModal(u)}>Edit</button>{' '}
                    <button onClick={() => deleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Plans</h2>
        {loadingPlans ? <p>Loading plans...</p> : (
          <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Nutrition Plan</th>
                <th>Fitness Plan</th>
                <th>Generated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 && <tr><td colSpan="5">No plans found.</td></tr>}
              {plans.map(p => (
                <tr key={p._id}>
                  <td>{p.userId?.name || "N/A"}</td>
                  <td>
                    <pre style={{ maxHeight: '150px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(p.nutritionPlan, null, 2)}
                    </pre>
                  </td>
                  <td>
                    <pre style={{ maxHeight: '150px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(p.fitnessPlan, null, 2)}
                    </pre>
                  </td>
                  <td>{new Date(p.generatedAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => deletePlan(p._id)}>Delete Plan</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '5px', width: '400px' }}>
            <h2>Edit User</h2>
            <form onSubmit={submitUserUpdate}>
              <label>Name:<br />
                <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} required />
              </label>
              <br />
              <label>Age (years):<br />
                <input type="number" name="age" value={editFormData.age} onChange={handleEditChange} required />
              </label>
              <br />
              <label>Weight (kg):<br />
                <input type="number" step="0.1" name="weight" value={editFormData.weight} onChange={handleEditChange} required />
              </label>
              <br />
              <label>Height (cm):<br />
                <input type="number" name="height" value={editFormData.height} onChange={handleEditChange} required />
              </label>
              <br />
              <label>Ethnicity:<br />
                <select name="ethnicity" value={editFormData.ethnicity} onChange={handleEditChange} required>
                  {Object.entries(ethnicityMap).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>Activity Level:<br />
                <select name="activityLevel" value={editFormData.activityLevel} onChange={handleEditChange} required>
                  {Object.entries(activityLevelMap).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>Income Ratio:<br />
                <select name="income" value={editFormData.income} onChange={handleEditChange} required>
                  {Object.entries(incomeMap).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>BMI Result:<br />
                <input type="number" step="0.1" name="bmi" value={editFormData.bmi} onChange={handleEditChange} required />
              </label>
              <br /><br />
              <button type="submit">Save</button>{' '}
              <button type="button" onClick={closeEditModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
