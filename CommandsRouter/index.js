const express = require('express');

module.exports = function (app) {
    app.use('/order', require('./OrdersRouter'));
}

