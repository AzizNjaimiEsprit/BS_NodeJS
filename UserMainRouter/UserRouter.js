const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');

// Redirect to login page

router.get('/loginPage', (req, res) => {
    res.render('../Views/my-account.twig');
});


// Add new user to database


async function registerUser (req, res) {
    try{
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        database.query('INSERT INTO user VALUES (NULL,?,?,?,?,?,?,?,?)', [
            req.body.fullName,
            req.body.email,
            req.body.phoneNumber,
            req.body.login,
            hashedPwd,
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
    } catch {
        res.status(500).send();
    }
    
}



router.post('/add', async (req, res) => registerUser(req, res));

router.post('/registerUser', async (req, res) => registerUser(req, res));


router.get('/register', (req, res) => {
    res.render('../Views/register.twig');
});
// Get user by login

function getUserByLogin (req, res) {

    return new Promise((resolve, reject) => {
        database.query('SELECT *, id as userId FROM user WHERE login = ?', [req.body.login], (err, rows, fields) => {
            if (!err) {
                resolve(rows);
            } else {
                reject(err);
            }
        });
    });
}

router.post('/login',async (req, res) => {
    const result = await getUserByLogin(req, res);
    if (result.length == 0) return res.status(200).send({
        result: 0,
        message: 'Cannot find User with this login'
    });
    try {
        if (await bcrypt.compare(req.body.password, result[0].password)) { 
            req.session.currentUser = result[0];
            res.status(200).send({
                result: 1,
                message: 'Login success',
                data: result[0]
            });
        }
        else res.status(200).send({
            result: 0,
            message: 'Wrong password'
        });
    } catch {
        res.status(500).send('Some error here');
    }
});

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mahdi.riahi@esprit.tn',
        pass: ''
    }
});

router.post('/sendCode',async (req, res) => {
    const result = await getUserByLogin(req, res);
    if (result.length == 0) return res.status(400).send('Cannot find User with this login');
    else {
        let code = require('crypto').randomBytes(15).toString('hex');
        const email = result[0].email;
        let mailOptions = {
            from: 'mahdi.riahi@esprit.tn',
            to: email,
            subject: 'Password reset request',
            text: `You requested a password change for your bookstore account\nCode : ${code}`
        }
        transporter.sendMail(mailOptions, (err, infos) => {
            if (err) res.status(200).send();
            else res.status(400).send("Verification code has been sent to you gmail account please write it down so we can verify it's you")
        });
    }
});

router.post('/verifyCode', (req, res) => {
    const userCode = req.body.code;
    const email = req.body.email;
    
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