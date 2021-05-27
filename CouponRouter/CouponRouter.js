const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const codeGenerator = require('./CodeGenerator')


// Add new coupon
router.post('/add', (req, res) => {
    code = codeGenerator.getCouponCode(15);

    database.query('INSERT INTO coupon VALUES (?,?,?)', [code, req.body.amount, req.body.userId], (err, rows) => {
        if (!err) { 
            res.status(200).send({
                coupon: code
            });
        }
        else {res.send('Operation failed');
            console.log(err);
        }
    });
});

// Get coupon by code

router.get('/get/:code', (req, res) => {
    database.query('SELECT * FROM coupon WHERE code = ?', [req.params.code], (err, rows) => {
        if (!err) {
            if (rows.length == 0) res.send('No such coupon');
            else res.send(rows[0]);
        }
        else res.send('Operation failed');
    });
});

// Get list coupon by user

router.get('/get/user/:userId', (req, res) => {
    database.query('SELECT * FROM coupon WHERE user_id = ?', [req.params.userId], (err, rows) => {
        if (!err) {
            if (rows.length == 0) res.send('No such coupon');
            else res.send(rows);
        }
        else res.send('Operation failed');
    });
});

// Get list coupon 

router.get('/get', (req, res) => {
    database.query('SELECT * FROM coupon', (err, rows) => {
        if (!err) {
            if (rows.length == 0) res.send('There is no coupons');
            else res.send(rows);
        }
        else res.send('Operation failed');
    });
});


// Delete a user from database

router.get('/delete/:code', (req, res) => {
    database.query('DELETE FROM coupon WHERE code = ?', [req.params.code], (err, rows) => {
        if (!err) res.send('Coupon deleted successfuly');
        else res.send('Coupon Deleting failed');
    })
});

module.exports = router;
