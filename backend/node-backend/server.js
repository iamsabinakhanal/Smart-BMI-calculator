// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
const adminRoutes = require('./routes/adminRoute');
app.use('/admin', adminRoutes);

// --- ADD THESE LINES FOR FEEDBACK ROUTES ---
const feedbackRoutes = require('./routes/feedback'); // Import feedback routes
app.use('/api/feedback', feedbackRoutes); // Use feedback routes under '/api/feedback' prefix
// -------------------------------------------

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});