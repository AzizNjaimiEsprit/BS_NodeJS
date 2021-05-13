const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");
const authController = require('../public/js/authConroller');


router.get('/',authController,(req, res) => {
    database.query('SELECT f.*,u.full_name FROM fidelity_cards f JOIN user u on f.user_id = u.id WHERE user_id = ?', [req.session.currentUser.userId], (err, rows, fields) => {
        if (err) {
            res.render('../Views/fidelity.twig',{card : [],pageName : "Fidelity Card"})
        } else {
            res.render('../Views/fidelity.twig',{card : rows[0],pageName : "Fidelity Card"})
        }
    })
})

router.post('/create', (req, res) => {
    database.query("insert into fidelity_cards values (NULL,?,?)",
        [
            req.body.points,
            req.body.userId,
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
    database.query("update fidelity_cards set points = points + ? where user_id = ?",
        [
            req.body.points,
            req.body.userId,
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

router.get('/user/get/:userId', (req, res) => {
    database.query('SELECT f.*,u.full_name FROM fidelity_cards f JOIN user u on f.user_id = u.id WHERE user_id = ?', [req.params.userId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.get('/delete/:userId', (req, res) => {
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