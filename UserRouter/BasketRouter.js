const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");

router.post('/add', (req, res) => {
    database.query("insert into basket values (?,?,?)",
        [
            req.body.bookId,
            req.body.userId,
            req.body.quantity,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('Inserted ' + data.insertId)
            }
        });
})

router.post('/update', (req, res) => {
    database.query("update basket set quantity = ? where user_id = ? and book_id = ?",
        [
            req.body.quantity,
            req.body.userId,
            req.body.bookId
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Updated");
                else
                    res.send("No record found !!!")
            }
        });
})

router.get('/cart',(req, res) => {
    req.session.username ="test"
    console.log(req.session.username)
    database.query('SELECT * FROM basket bs join book bk on bs.book_id = bk.id WHERE user_id = 3', [req.params.userId], async (err, rows, fields) => {
        if (err) {
            res.render('../Views/basket.twig',{rows : []})
        } else {
            res.render('../Views/basket.twig',{rows : rows})
        }
    })
})

router.get('/user/get/:userId', async (req, res) => {
    console.log(req.session.username)
    database.query('SELECT * FROM basket bs join book bk on bs.book_id = bk.id WHERE user_id = ?', [req.params.userId], async (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.post('/delete', (req, res) => {
    database.query("delete from basket where user_id = ? and book_id = ?",
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