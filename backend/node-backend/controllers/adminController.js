const User = require('../models/User');
const Plan = require('../models/Plan');
const axios = require('axios');

function getLifestyleLabel(value) {
  const map = {
    1: "Sedentary",
    2: "Lightly Active",
    3: "Moderately Active",
    4: "Very Active",
    5: "Extremely Active"
  };
  return map[value] || "Moderately Active";
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().populate('userId').sort({ generatedAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, age, weight, height, bmi, lifestyle, income, ethnicity } = req.body;

    const newUser = new User({
      name,
      age,
      weight,
      height,
      bmi,
      lifestyle,
      income,
      ethnicity
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Add User Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    await Plan.deleteMany({ userId: id });
    res.json({ message: 'User and related plans deleted' });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    await Plan.findByIdAndDelete(id);
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete plan" });
  }
};

exports.regeneratePlan = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const lifestyleLabel = getLifestyleLabel(user.lifestyle);

    const nutritionRes = await axios.post('http://localhost:5000/generate-plan', {
      type: 'nutrition',
      age: user.age,
      bmi: user.bmi,
      lifestyle: lifestyleLabel,
      income: user.income,
      ethnicity: user.ethnicity
    });

    const fitnessRes = await axios.post('http://localhost:5000/generate-plan', {
      type: 'fitness',
      age: user.age,
      bmi: user.bmi,
      lifestyle: lifestyleLabel,
      income: user.income,
      ethnicity: user.ethnicity
    });

    const newPlan = new Plan({
      userId: user._id,
      nutritionPlan: nutritionRes.data.plan,
      fitnessPlan: fitnessRes.data.plan
    });

    await newPlan.save();
    res.json({ message: 'Plan regenerated', plan: newPlan });
  } catch (error) {
    console.error("Flask error:", error.response?.data || error.message);
    res.status(500).json({ message: 'Flask AI server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const averageBMI = await User.aggregate([{ $group: { _id: null, avgBMI: { $avg: "$bmi" } } }]);
    const goalDistribution = await User.aggregate([
      { $group: { _id: "$lifestyle", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      averageBMI: averageBMI[0]?.avgBMI || 0,
      goalDistribution
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
