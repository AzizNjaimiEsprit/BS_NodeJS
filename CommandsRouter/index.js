const express = require('express');

module.exports = function (app) {
    app.use('/order', require('./OrdersRouter'));
    app.use('/payment', require('./PaymentRouter'));
    app.use('/basket', require('../CommandsRouter/BasketRouter'));
}

