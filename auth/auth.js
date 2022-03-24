const express = require('express');
const cors = require('cors');
const db = require('./db/index');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const router = express.Router();

let corsOptionsNoDotenv = {
    origin: 'http://localhost:8083'
};

let corsOptionsDotEnv = {
    origin: 'http://localhost:3003'
};

if (process.env.AUTH_PORT) {
    app.use(cors(corsOptionsDotEnv));
} else {
    app.use(cors(corsOptionsNoDotenv));
}

// Content Types
app.use(express.json());
app.use(express.urlencoded({extended: true}));

db.initializeDatabase();

// Routes
require('./routes/auth.routes')(app);
require('./routes/pwReset.routes')(app);
require('./routes/verification.routes')(app);
app.use('/api/auth', router);

// set port
const PORT = process.env.AUTH_PORT || 8082;
app.listen(PORT, () => {
    console.log(`Auth Server running on port ${PORT}.`);
});