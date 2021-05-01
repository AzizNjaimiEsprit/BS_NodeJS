const express = require('express');

module.exports = function (app) {
    app.use('/blog', require('./PostsRouter'));
    app.use('/comment', require('./CommentRouter'));

}

