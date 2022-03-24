const express = require('express');
const cors = require('cors');
require('dotenv').config();
//const db = require('./app/database/config');


const app = express();
//db.sequelize.sync();

let corsOptions = {
    origin: 'http://localhost:8081'
};

/*
db.sequelize.sync({ force: true }).then(() => {
    console.log("Please drop and re-sync DB");
});
*/


app.use(cors(corsOptions));

// JSON content type
app.use(express.json());

app.use(express.urlencoded({extended: true}));

// set port
const PORT = process.env.RESOURCE_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});