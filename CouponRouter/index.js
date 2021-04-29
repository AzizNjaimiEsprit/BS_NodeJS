const express = require('express');

module.exports = function (app) {
    app.use('/coupon', require('./CouponRouter'));
}