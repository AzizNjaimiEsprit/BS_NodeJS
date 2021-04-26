const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");

router.post('/add', (req, res) => {
    database.query("insert into post values (NULL,?,?,?)",
        [
            req.body.publisherId,
            yyyymmdd.withTime(),
            req.body.body,
        ],
        function (err, data) {
            if (err) {
                res.send("error" + err);
            } else {
                res.send('Inserted' + data.insertId)
            }
        });
})

router.post('/update', (req, res) => {
    database.query("update post set body = ? where id = ?",
        [
            req.body.body,
            req.body.id,
        ],
        function (err, data) {
            if (err) {
                res.send("error" + err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Updated");
                else
                    res.send("No record found !!!")
            }
        });
})

router.get('/user/get/:userId', (req, res) => {
    database.query('SELECT * FROM post WHERE publisher_id = ?', [req.params.userId], async (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.get('/delete/:id', (req, res) => {
    database.query("delete from post where id = ?",
        [
            req.params.id
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