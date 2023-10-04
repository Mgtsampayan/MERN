const express = require('express');
const bodyParser = require('body-parser');
const paydayRoutes = require('./routes/api/paydayRoutes');
const users =require('./routes/api/users');
const connectDB = require('./config/db');
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API is Running Successfully'));

// Connect to DB
connectDB();

// Routes
app.use('/paydays', paydayRoutes);
app.use('/api/users', users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));