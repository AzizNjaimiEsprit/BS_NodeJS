const express = require('express');

module.exports = function (app) {
    app.use('/category', require('./CategoryRouter'));
}

