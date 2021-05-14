const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");

router.post('/add', (req, res) => {
    database.query("insert into category values (?,?)",
        [
            req.body.id,
            req.body.name,

        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('Inserted category' + data.insertId)
            }
        });
})

router.post('/update', (req, res) => {
    database.query("update category set name = ? where id = ? ",
        [
            req.body.name,
            req.body.id,
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

router.get('/getAll',(req, res) => {
    database.query('SELECT * FROM category ', (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})

router.get('/get/:catId', (req, res) => {
    database.query('SELECT * FROM category WHERE id = ?',
        [req.params.catId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.post('/delete', (req, res) => {
    database.query("delete from category where  id = ?",
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