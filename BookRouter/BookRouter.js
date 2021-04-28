const express = require('express');
const router = express.Router();
const database = require('../config/db.config');


router.post('/addBook', (req, res) => {
    database.query("insert into book values (null,?,?,?,?,?,?,?,?,?,?,?)",
        [
            req.body.title,
            req.body.price,
            req.body.pub_house,
            req.body.summary,
            req.body.release_date,
            req.body.quantity,
            req.body.status,
            req.body.category_id,
            req.body.image,
            req.body.nb_page,
            req.body.author,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('Inserted Book' + data.insertId)
            }
        });
})
router.get('/getById/:bookId', async (req, res) => {
    database.query('SELECT * FROM book WHERE id = ?', [req.params.bookId], async (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})

router.get('/getAll', async (req, res) => {
    database.query('SELECT * FROM book ', async (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})
router.post('/deleteBook', (req, res) => {
    database.query("delete from book where id = ? ",
        [
            req.body.bookId,
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