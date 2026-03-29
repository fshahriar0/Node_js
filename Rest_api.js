const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'customer',
  password: 'Farhan001731@#', // 🔥 put your postgres password here
  port: 5432,
});


// GET all customers
app.get('/api/customers', async (req, res) => {
  const result = await pool.query('SELECT * FROM customers');
  res.json(result.rows);
});


// GET customer by id
app.get('/api/customers/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM customers WHERE id = $1',
    [req.params.id]
  );

  result.rows.length
    ? res.json(result.rows[0])
    : res.status(404).send('Customer not found');
});


// POST add new customer
app.post('/api/customers', async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;

  const result = await pool.query(
    'INSERT INTO customers (firstname, lastname, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
    [firstname, lastname, email, phone]
  );

  res.status(201).json(result.rows[0]);
});


// PUT update customer
app.put('/api/customers/:id', async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;

  const result = await pool.query(
    'UPDATE customers SET firstname=$1, lastname=$2, email=$3, phone=$4 WHERE id=$5 RETURNING *',
    [firstname, lastname, email, phone, req.params.id]
  );

  result.rows.length
    ? res.json(result.rows[0])
    : res.status(404).send('Customer not found');
});


// DELETE customer
app.delete('/api/customers/:id', async (req, res) => {
  await pool.query('DELETE FROM customers WHERE id=$1', [req.params.id]);
  res.send('Customer deleted');
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});