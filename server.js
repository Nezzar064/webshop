const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/db/index');


const app = express();
db.sequelize.sync();

let corsOptions = {
    origin: ''
};

if (process.env.RESOURCE_PORT) {
    corsOptions.origin = 'http://localhost:3001';
} else {
    corsOptions.origin = 'http://localhost:8081';
}

/*
db.sequelize.sync({ force: true }).then(() => {
    console.log("Please drop and re-sync DB");
});
*/

app.use(cors(corsOptions));

// content types
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// IMPLEMENT RATE LIMITER PLEASE

// Routes
require('./src/routes/order.routes')(app);
require('./src/routes/product.routes')(app);
require('./src/routes/orderItem.routes')(app);
require('./src/routes/contactInfo.routes')(app);

// set port
const PORT = process.env.RESOURCE_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Resource server running on port ${PORT}.`);
});