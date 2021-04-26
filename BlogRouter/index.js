const express = require('express');

module.exports = function (app) {
    app.use('/post', require('./PostsRouter'));
    app.use('/comment', require('./CommentRouter'));

}

