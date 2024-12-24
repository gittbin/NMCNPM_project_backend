const express=require('express')
const morgan = require('morgan')
const cors = require('cors');
const routes = require('./routes/main')
const path = require('path');
const app = express()
const mongodb=require('./modules/config/db')
const bodyParser = require('body-parser');
const setupSocket = require("./modules/config/socket");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
require('dotenv').config();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'))
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
mongodb()
routes(app)
const server =app.listen(5000, () => {
    console.log('Server đang chạy tại http://localhost:5000');
});
const io =setupSocket(server);
require('./controllers/chat')(io)