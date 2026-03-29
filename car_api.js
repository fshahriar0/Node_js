const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET_KEY = 'mysecretkey';

// ✅ MongoDB Atlas connection
mongoose.connect('mongodb+srv://farhan:1234@cluster0.2jyfpyz.mongodb.net/cardb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Schema
const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  color: String,
  year: Number
});

const Car = mongoose.model('Car', carSchema);


// 🔐 LOGIN ROUTE
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '1234') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});


// 🛡️ MIDDLEWARE
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


// 🔒 PROTECTED ROUTES

// GET all cars
app.get('/cars', authenticateToken, async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

// POST add new car
app.post('/cars', authenticateToken, async (req, res) => {
  const newCar = new Car(req.body);
  await newCar.save();
  res.status(201).json(newCar);
});

// PUT update car
app.put('/cars/:id', authenticateToken, async (req, res) => {
  const updatedCar = await Car.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedCar);
});

// DELETE car
app.delete('/cars/:id', authenticateToken, async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.send('Car deleted');
});

// DELETE all cars
app.delete('/cars', authenticateToken, async (req, res) => {
  await Car.deleteMany({});
  res.send('All cars deleted');
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});