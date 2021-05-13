const express = require('express');

module.exports = function (app) {
    app.use('/library', require('./LibraryRouter'));
}