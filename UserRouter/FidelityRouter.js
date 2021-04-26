const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");

router.post('/create', (req, res) => {
    database.query("insert into fidelity_cards values (NULL,?,?)",
        [
            req.body.userId,
            req.body.points,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('Inserted ' + data.insertId)
            }
        });
})

router.post('/addPoints', (req, res) => {
    database.query("update fidelity_cards set points = ? where user_id = ?",
        [
            req.body.userId,
            req.body.points,
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

router.get('/user/get/:userId', async (req, res) => {
    database.query('SELECT * FROM fidelity_cards WHERE user_id = ?', [req.params.userId], async (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.post('/delete/:userId', (req, res) => {
    database.query("delete from fidelity_cards where user_id = ?",
        [
            req.params.userId,
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