const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const authController = require('../public/js/authConroller');
let yyyymmdd = require("yyyy-mm-dd");

router.post('/add', (req, res) => {
    database.query("insert into basket values (?,?,?,?)",
        [
            req.body.bookId,
            req.body.userId,
            req.body.quantity,
            req.body.type,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('ok')
            }
        });
})

router.post('/update', (req, res) => {
    database.query("update basket set quantity = ? , type = ? where user_id = ? and book_id = ?",
        [
            req.body.quantity,
            req.body.type,
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

router.get('/' , authController ,(req, res) => {
    database.query('SELECT *,bs.quantity as bQuantity FROM basket bs join book bk on bs.book_id = bk.id WHERE user_id = ?', [req.session.currentUser.userId], (err, rows, fields) => {
        res.render('../Views/basket.twig',{rows : rows,pageName : 'Basket'})
    })
})

router.get('/user/get/:userId', (req, res) => {
    console.log(req.session.username)
    database.query('SELECT *,bs.quantity as bQuantity FROM basket bs join book bk on bs.book_id = bk.id WHERE user_id = ?', [req.params.userId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})

router.get('/getCount/:bookId', (req, res) => {
    database.query('SELECT count(user_id) as count FROM basket WHERE book_id = ? and user_id = ?', [req.params.bookId,req.session.currentUser.userId], (err, rows, fields) => {
        res.send(''+rows[0].count)
    })
})

router.get('/deleteUserBasket/:userId', (req, res) => {
    database.query("delete from basket where user_id = ?",
        [
            req.params.userId,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send("Deleted");
            }
        });
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
