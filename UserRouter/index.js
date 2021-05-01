const express = require('express');

module.exports = function (app) {

    app.use('/wishList', require('./WishListRouter'));
    app.use('/fidelity', require('./FidelityRouter'));
}

