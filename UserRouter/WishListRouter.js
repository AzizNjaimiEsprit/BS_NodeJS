const express = require('express');
const router = express.Router();
const database = require('../config/db.config');

router.post('/add', (req, res) => {
    database.query("insert into wishlist values (?,?)",
        [
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

router.get('/', (req, res) => {
    database.query('SELECT * FROM wishlist bs join book bk on bs.book_id = bk.id  WHERE user_id = ?', [req.session.currentUser.userId], (err, rows, fields) => {
        if (err) {
            res.render('../Views/wishlist.twig',{rows : []})
        } else {
            res.render('../Views/wishlist.twig',{rows : rows})
        }
    })
})

router.get('/user/get/:userId', (req, res) => {
    database.query('SELECT * FROM wishlist bs join book bk on bs.book_id = bk.id WHERE user_id = ?', [req.params.userId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.post('/delete', (req, res) => {
    database.query("delete from wishlist where user_id = ? and book_id = ?",
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