const express = require('express');
const router = express.Router();
const database = require('../config/db.config');

router.get('/login',(req, res) => {
    req.session.username = "aziz";
    req.session.userId = 3;
    res.send("Ok")
})

// Add new user to database
router.post('/add', (req, res) => {
    database.query('INSERT INTO user VALUES (NULL,?,?,?,?,?,?,?,?)', [
        req.body.fullName,
        req.body.email,
        req.body.phoneNumber,
        req.body.login,
        req.body.password,
        req.body.role,
        req.body.adress,
        req.body.zipCode
    ], (err, rows) => {
        if (!err) res.send('User added successfuly');
        else {
            res.send('Adding user failed');
            console.log(err);
        }
    })
});



// Update existing user in the database

router.post('/update/:id', (req, res) => {
    database.query(`UPDATE user SET full_name = ?,
                                    email = ?,
                                    telephone = ?,
                                    login = ?,
                                    password = ?,
                                    role = ?,
                                    address = ?,
                                    zip_code = ?
                                WHERE id = ?` 
    ,[
        req.body.fullName,
        req.body.email,
        req.body.phoneNumber,
        req.body.login,
        req.body.password,
        req.body.role,
        req.body.adress,
        req.body.zipCode,
        req.params.id
    ], (err, rows, fields) => {
        if (!err) {
            if (rows.affectedRows > 0) res.send('User updated successfuly');
        }
        else res.send('Updating user failed');
    })
});

// Get user by login

router.get('/get/login/:login', (req, res) => {
    database.query('SELECT * FROM user WHERE login = ?', [req.params.login], (err, rows, fields) => {
        if (!err) {
            if (rows.length > 0) res.send(rows);
            else res.send('No such login found');
        } else {
            res.send('Database operation failed');
        }
    });
});

// Get user by id

router.get('/get/:id', (req, res) => {
    database.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            if (rows.length > 0) res.send(rows);
            else res.send('No such user found');
        } else {
            res.send('Database operation failed');
        }
    });
});

// Get list of users

router.get('/get', (req, res) => {
    database.query('SELECT * FROM user', (err, rows, fields) => {
        if (!err) res.send(rows);
        else res.send('Database operation failed');
    });
});

// Delete a user from database

router.get('/delete/:id', (req, res) => {
    database.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        if (!err) res.send('User deleted successfuly');
        else res.send('User Deleting failed');
    })
});

module.exports = router;