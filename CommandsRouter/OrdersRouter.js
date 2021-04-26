const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");

router.post('/add', (req, res) => {
    let items = req.body.items;
    database.query("insert into orders values (NULL,?,?,?,?,?,?,?,?)", [req.body.address, req.body.numTel, yyyymmdd.withTime(), req.body.paymentID, req.body.status, req.body.totalPrice, req.body.zipCode, req.body.userId], function (err, data) {
        if (err) {
            res.send(err);
        } else {

            for (let i = 0; i < items.length; i++) {
                database.query("insert into order_item values (NULL,?,?,?)", [items[i].quantity, items[i].bookId, data.insertId], function (err, data2) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Done" + data2.insertId);
                    }
                });
            }
            res.send("Done" + data.insertId);
        }
    });
})

router.post('/update', (req, res) => {
    let items = req.body.items;
    database.query("update orders set total_price=?,address=?,zip_code=?,num_tel=?,status=? where id=?",
        [req.body.totalPrice,
            req.body.address,
            req.body.zipCode,
            req.body.numTel,
            req.body.status,
            req.body.id
        ], function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Updated" + req.body.id);
                else
                    res.send("No record found !!!")
            }
        });
})

router.get('/get/:id', (req, res) => {
    database.query('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            database.query('SELECT * FROM order_item WHERE order_id = ' + Number(rows[0].id), [], async (err2, rows2, fields2) => {
                rows[0]['items'] = rows2;
                res.send(rows);
            })
        } else
            res.send("No order found with this ID !!!");
    })
})

router.get('/user/get/:userId', async (req, res) => {
    database.query('SELECT * FROM orders WHERE user_id = ?', [req.params.userId], async (err, rows, fields) => {
        if (!err && rows.length != 0) {

            for (let i = 0; i < rows.length; i++) {
                database.query('SELECT * FROM order_item WHERE order_id = ' + Number(rows[i].id), [], async (err2, rows2, fields2) => {
                    rows[i]['items'] = rows2;
                    if (i == rows.length - 1)
                        res.send(rows);
                })
            }
        } else
            res.send("No orders found for this user !!!");
    })
})


module.exports = router;