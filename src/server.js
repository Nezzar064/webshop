const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db.config');
const {routes: productRouter } = require('./components/product');
const {routes: orderRouter } = require('./components/order');
const {routes: orderItemRouter } = require('./components/orderItem');
const {routes: contactInfoRouter } = require('./components/contactInfo');


const app = express();
// Sync models to DB
db.sequelize.sync().then(() => console.log(`Successfully synced DB models`));


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

// Routers
productRouter(app);
orderRouter(app);
orderItemRouter(app);
contactInfoRouter(app);

// set port
const PORT = process.env.RESOURCE_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Resource server running on port ${PORT}.`);
});