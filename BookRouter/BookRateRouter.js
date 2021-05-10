const express = require('express');
const router = express.Router();
const database = require('../config/db.config');

router.post('/addRate', (req, res) => {
    database.query("insert into rate values (null,?,?,?)",
        [
            req.body.rate,
            req.body.bookId,
            req.body.userId,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('Inserted rate' + data.insertId)
            }
        });
})

router.post('/updateRate', (req, res) => {
    database.query("update rate set rate = ? where user_id = ? and book_id = ?",
        [
            req.body.rate,
            req.body.userId,
            req.body.bookId,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('updated rate' )
            }
        });
})

router.get('/getListRate/:bookId',  (req, res) => {
    database.query('SELECT * FROM rate WHERE book_id = ?', [req.params.bookId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.post('/deleteRate', (req, res) => {
    database.query("delete from rate where user_id = ? and book_id = ?",
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
router.get('/getMoyenneRate/:bookId',  (req, res) => {
    database.query('SELECT AVG(rate) as rate FROM rate WHERE book_id = ?', [req.params.bookId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(""+rows[0].rate)
        }
    })
})

module.exports = router;