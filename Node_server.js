const express = require('express');
const app = express();

// ✅ Use dynamic port (IMPORTANT for Azure)
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

// ✅ Dummy data (NO database)
let customers = [
  { id: 1, firstname: 'John', lastname: 'Johnson', email: 'john@johnson.com', phone: '8233243' },
  { id: 2, firstname: 'Mary', lastname: 'Smith', email: 'mary@smith.com', phone: '6654113' },
  { id: 3, firstname: 'Peter', lastname: 'North', email: 'peter@north.com', phone: '901176' }
];

// ✅ Show all customers
app.get('/customers', (req, res) => {
  res.render('customers', { customers });
});

// ✅ Show form page
app.get('/add', (req, res) => {
  res.render('addcustomer');
});

// ✅ Add customer
app.post('/add', (req, res) => {
  const newCustomer = {
    id: Date.now(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone
  };

  customers.push(newCustomer);
  res.redirect('/customers');
});

// ✅ Optional: redirect root to customers
app.get('/', (req, res) => {
  res.redirect('/customers');
});

// ✅ Start server using dynamic port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});