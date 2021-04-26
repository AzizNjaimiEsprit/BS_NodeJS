const express = require('express');

module.exports = function (app) {
    app.use('/basket', require('./BasketRouter'));
    app.use('/wishList', require('./WishListRouter'));
    app.use('/fidelity', require('./FidelityRouter'));
}

