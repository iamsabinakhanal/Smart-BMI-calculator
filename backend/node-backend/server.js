const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bmidb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


// Test route
app.get('/', (req, res) => {
  res.send('Hello from Node backend!');
});

// Prediction route calling Python API
app.post('/predict', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/predict', req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error calling Python prediction API' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
