
module.exports = function (app) {
    app.use('/book', require('./BookRouter'));
    app.use('/onlineBook', require('./OnlineBookRouter'));

}