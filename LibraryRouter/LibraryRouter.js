const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
var path = require('path');
const authController = require('../public/js/authConroller');

router.get('/',authController, (req, res) => {
    database.query('SELECT * from library l join book b on l.book_id = b.id WHERE user_id = ?', [req.session.currentUser.userId], (err, rows, fields) => {
        res.render('../Views/library.twig', {books: rows , pageName : 'Library'})
    })
})

router.post('/add', (req, res) => {
    database.query("insert into library values (?,?,?)",
        [
            req.body.id,
            req.body.name,
            req.body.pagereached

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
    database.query("update library set page_reached = ? where book_id = ? and user_id= ? ",
        [
            req.body.pagereached,
            req.body.bookId,
            req.body.userId
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.affectedRows == 1)
                    res.send('ok');
                else
                    res.send("No record found !!!")
            }
        });
})

router.get('/getAll',(req, res) => {
    database.query('SELECT * FROM library ', (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.post('/delete', (req, res) => {
    database.query("delete from library where   where book_id = ? and user_id= ?",
        [
            req.body.id
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