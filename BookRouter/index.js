
module.exports = function (app) {
    app.use('/book', require('./BookRouter'));
    app.use('/bookRate', require('./BookRateRouter'));
    app.use('/bookComment', require('./BookCommentRouter'));

}