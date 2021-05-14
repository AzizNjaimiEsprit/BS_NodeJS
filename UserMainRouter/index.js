const express = require('express');

module.exports = function (app) {
    app.use('/account', require('./UserRouter'));
}