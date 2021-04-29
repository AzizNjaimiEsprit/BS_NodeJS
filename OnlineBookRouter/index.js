const express = require('express');

module.exports = function (app) {
    app.use('/onlineBook', require('./OnlineBookRouter'));
}