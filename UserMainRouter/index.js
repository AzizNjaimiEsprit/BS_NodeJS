const express = require('express');

module.exports = function (app) {
    app.use('/users', require('./UserRouter'));
}