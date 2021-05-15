const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const authController = require('../public/js/authConroller');

router.post('/addComment', (req, res) => {
    database.query("insert into comment values (null,?,?,?)",
        [
            req.body.text,
            req.body.bookId,
            req.body.userId,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('ok')
            }
        });
})

router.post('/updateComment',authController, (req, res) => {
    database.query("update comment set text = ? where user_id = ? and book_id = ?",
        [
            req.body.text,
            req.body.userId,
            req.body.bookId
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Comment Updated");
                else
                    res.send("No record found !!!")
            }
        });
})

router.get('/getComment/:bookId',  (req, res) => {
    database.query('SELECT * FROM comment WHERE book_id = ?', [req.params.bookId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.post('/deleteComment', (req, res) => {
    database.query("delete from comment where user_id = ? and book_id = ?",
        [
            req.body.userId,
            req.body.bookId
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Deleted");
                else
                    res.send("No record found !!!")
            }
        });
})


module.exports = router;