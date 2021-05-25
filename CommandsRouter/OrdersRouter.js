const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const authController = require('../public/js/authConroller');
let yyyymmdd = require("yyyy-mm-dd");


router.get('/checkout', authController, (req, res) => {
    database.query('SELECT *,bs.quantity as bQuantity FROM basket bs join book bk on bs.book_id = bk.id WHERE user_id = ?', [req.session.currentUser.userId], (err, rows, fields) => {
        res.render('../Views/checkout.twig', {rows: rows, currentUser: req.session.currentUser, pageName: 'Checkout'})
    })
})

router.get('/ordersList/:status', authController, (req, res) => {
    let critere = ""
    if (req.params.status == "all") {
        critere = "status" //all
    } else if (req.params.status == "closed") {
        critere = "'treated'"
    } else if (req.params.status == "open") {
        critere = "'untreated' OR status = 'inDelivery'"
    }
    database.query('SELECT * FROM orders WHERE status = ' + critere + ' ORDER BY order_date ASC', (err, rows, fields) => {
        if (!err && rows.length != 0) {
            for (let i = 0; i < rows.length; i++) {
                database.query('SELECT *, oi.quantity as orderedQuantity FROM order_item oi join book b on b.id = oi.book_id WHERE order_id = ' + Number(rows[i].id), [], (err2, rows2, fields2) => {
                    rows[i]['items'] = rows2;
                    if (i == rows.length - 1)
                        res.render('../Views/adminOrdersList.twig', {orders: rows, pageName: "My Orders"})
                })
            }
        } else
            res.render('../Views/adminOrdersList.twig', {orders: [], pageName: "My Orders"})
    })
})

router.get('/myOrders/:status', authController, (req, res) => {
    let critere = ""
    if (req.params.status == "all") {
        critere = "status" //all
    } else if (req.params.status == "closed") {
        critere = "'treated'"
    } else if (req.params.status == "open") {
        critere = "'untreated' OR status = 'inDelivery'"
    }
    database.query('SELECT * FROM orders WHERE user_id = ? and status = ' + critere + ' ORDER BY order_date ASC', [req.session.currentUser.userId], (err, rows, fields) => {
        if (!err && rows.length != 0) {
            for (let i = 0; i < rows.length; i++) {
                database.query('SELECT *, oi.quantity as orderedQuantity FROM order_item oi join book b on b.id = oi.book_id WHERE order_id = ' + Number(rows[i].id), [], (err2, rows2, fields2) => {
                    rows[i]['items'] = rows2;
                    if (i == rows.length - 1)
                        res.render('../Views/myOrders.twig', {orders: rows, pageName: "My Orders"})
                })
            }
        } else
            res.render('../Views/myOrders.twig', {orders: [], pageName: "My Orders"})
    })
})


router.post('/add', (req, res) => {
    let items = req.body.items;
    database.query("insert into orders values (NULL,?,?,?,?,?,?,?,?)", [req.body.address, req.body.numTel, yyyymmdd.withTime(), req.body.paymentID, req.body.status, req.body.totalPrice, req.body.zipCode, req.body.userId], function (err, data) {
        if (err) {
            res.send(err);
        } else {
            database.query('SELECT * FROM basket WHERE user_id = ?', [req.session.currentUser.userId], (err, items, fields) => {
                if (err) {
                    res.send(err);
                } else {
                    for (let i = 0; i < items.length; i++) {
                        database.query("insert into order_item values (NULL,?,?,?,?)", [items[i].quantity, items[i].book_id, data.insertId,items[i].type], function (err, data2) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Done" + data2.insertId);
                            }
                        });
                        if (items[i].type == "ONLINE") {
                            database.query("insert into library values (?,?,?)", [items[i].book_id, req.session.currentUser.userId, 0], function (err3, data3) {
                                if (err3) {
                                    console.log(err3);
                                } else {
                                    console.log("Added To library" + items[i].book_id);
                                }
                            });
                        }
                    }
                    res.send("Done");
                }
            })
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

router.post('/updateStatus', (req, res) => {
    let items = req.body.items;
    database.query("update orders set status=? where id=?",
        [
            req.body.status,
            req.body.id
        ], function (err, data) {
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

router.get('/user/get/:userId', (req, res) => {
    database.query('SELECT * FROM orders WHERE user_id = ?', [req.params.userId], (err, rows, fields) => {
        if (!err && rows.length != 0) {
            for (let i = 0; i < rows.length; i++) {
                database.query('SELECT * FROM order_item oi join book b on b.id = oi.book_id WHERE order_id = ' + Number(rows[i].id), [], (err2, rows2, fields2) => {
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
