const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");

router.post('/add', (req, res) => {
    console.log("Body = ",req.body)
    database.query("insert into post_comment values (NULL,?,?,?,?)",
        [
            req.body.publisherId,
            req.body.postId,
            req.body.body,
            yyyymmdd.withTime(),
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
    database.query("update post_comment set body = ? where id = ?",
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
    database.query('SELECT p.*,u.full_name FROM post_comment p JOIN user u on p.publisher_id = u.id WHERE publisher_id = ?', [req.params.userId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})

router.get('/post/get/:postId', (req, res) => {
    database.query('SELECT * FROM post_comment WHERE post_id = ?', [req.params.postId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.get('/delete/:id', (req, res) => {
    database.query("delete from post_comment where id = ?",
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