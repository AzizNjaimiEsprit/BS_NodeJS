const express = require('express');
const router = express.Router();
const database = require('../config/db.config');


router.post('/addBook', (req, res) => {
    database.query("insert into online_book values (null,?,?)",
        [
            req.body.url,
            req.body.book_id

        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('Inserted Online Book' + data.insertId)
            }
        });
})
router.get('/getById/:onlineBookId',  (req, res) => {
    database.query("SELECT c.* , b.*, url from online_book join book b on online_book.book_id = b.id join category c on b.category_id = c.id WHERE b.id=?", [req.params.onlineBookId],  (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})

router.get('/getAll',  (req, res) => {
    database.query("SELECT c.* , b.*, url from online_book join book b on online_book.book_id = b.id join category c on b.category_id = c.id ",  (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})
router.post('/deleteOnlineBook', (req, res) => {
    database.query("delete from online_book where id = ? ",
        [
            req.body.onlineBookId,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Online Book Deleted");
                else
                    res.send("No record found !!!")
            }
        });
})

module.exports = router;