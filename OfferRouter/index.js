const express = require('express');

module.exports = function (app) {
    app.use('/offers', require('./OfferRouter'));
}