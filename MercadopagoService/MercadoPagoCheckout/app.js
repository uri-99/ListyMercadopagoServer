var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

const PaymentController = require("./controllers/PaymentController");
//importamos el controller

const PaymentService = require("./services/PaymentService");
//importamos el service

const PaymentInstance = new PaymentController(new PaymentService());
// Permitimos que el controller pueda usar el service

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var cors = require("cors");
app.use(cors());

app.post("/payment/new", (req, res) =>
    PaymentInstance.getMercadoPagoLink(req, res)
);

app.post("/webhook", (req, res) => PaymentInstance.webhook(req, res));

module.exports = app;
