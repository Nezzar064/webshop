const express = require('express');
const cors = require('cors');
const db = require('./db/index');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

let corsOptions = {
    origin: ''
};

if (process.env.AUTH_PORT) {
    corsOptions.origin = 'http://localhost:3003';
} else {
    corsOptions.origin = 'http://localhost:8083';
}

// IMPLEMENT RATE LIMITER PLEASE

app.use(cors(corsOptions));

// Content Types
app.use(express.json());
app.use(express.urlencoded({extended: true}));

db.initializeDatabase();

// Routes
require('./routes/auth.routes')(app);
require('./routes/verification.routes')(app);

// set port
const PORT = process.env.AUTH_PORT || 8082;
app.listen(PORT, () => {
    console.log(`Auth Server running on port ${PORT}.`);
});