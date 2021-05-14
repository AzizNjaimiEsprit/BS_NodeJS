const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const authController = require('../public/js/authConroller');

router.post('/add',(req, res) => {
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

router.get('/', authController,(req, res) => {
    database.query('SELECT * FROM wishlist bs join book bk on bs.book_id = bk.id  WHERE user_id = ?', [req.session.currentUser.userId], (err, rows, fields) => {
        res.render('../Views/wishlist.twig',{rows : rows,pageName : 'WishList'})
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

router.get('/getCount/:bookId', (req, res) => {
    database.query('SELECT count(user_id) as count FROM wishlist WHERE book_id = ? and user_id = ?', [req.params.bookId,req.session.currentUser.userId], (err, rows, fields) => {
        res.send(''+rows[0].count)
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
