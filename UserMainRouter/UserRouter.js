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
            if (!err) res.send({
                result: 1,
                message: 'Your account has been added'
            });
            else {
                res.send({
                    result: 0,
                    message: 'Sorry an error has been occured try again'
                });
                console.log(err);
            }
        })    
    } catch {
        res.status(500).send();
    }
    
}


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


router.post('/add', async (req, res) => registerUser(req, res));

router.post('/registerUser', async (req, res) => {
    let users = await getUserByLogin(req, res);
    if (users.length == 0)
        registerUser(req, res);
    else {
        res.send({
        result: 0,
        message: 'Login already exist'
        });
    }   
});


router.get('/register', (req, res) => {
    res.render('../Views/register.twig');
});
// Get user by login


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


// Don't forget to remove email credentials
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mahdi.riahi@esprit.tn',
        pass: 'rqttzhatbceiixay'
    }
});


function saveCode(code, email) {
    return new Promise((resolve, reject) => {
        database.query('INSERT INTO pwdCodes VALUES (NULL,?,?)', [email, code], (err, rows, fields) => {
            if (!err) {
                console.log("Code saved");
                resolve();
            } else {
                reject(err);
            }
        });
    });
}


router.post('/sendCode',async (req, res) => {
    const result = await getUserByLogin(req, res);
    if (result.length == 0) return res.send({
        result: 0,
        message: 'No account with this login : ' + req.body.login
    });
    else {
        let code = require('crypto').randomBytes(15).toString('hex');
        console.log(code);
        const email = result[0].email;
        let mailOptions = {
            from: 'mahdi.riahi@esprit.tn',
            to: email,
            subject: 'Password reset request',
            text: `You requested a password change for your bookstore account\nCode : ${code}`
        }
        await saveCode(code, email).then(() => {
            console.log("Sending email to user...");
            transporter.sendMail(mailOptions, (err, infos) => {
                if (err) console.log(err);
                else {
                    console.log("Mail has been sent successfully");
                    return res
                    .send({
                        result: 1,
                        message: 'Code has been sent',
                        email: email
                    })

                }
            });

            
        }).catch(err => {
            console.log("Something wrong happened");
        })
        

        
    
    }
});

router.get('/verif-code', (req, res) => {
    res.render('../Views/verif-code.twig');
});



function getUserByEmail (req, res) {

    return new Promise((resolve, reject) => {
        database.query('SELECT *, id as userId FROM user WHERE email = ?', [req.body.email], (err, rows, fields) => {
            if (!err) {
                resolve(rows);
            } else {
                reject(err);
            }
        });
    });
}

function getCode (req, res) {

    return new Promise((resolve, reject) => {
        database.query('SELECT * FROM pwdCodes WHERE email = ? AND code_text = ?', [[req.body.email], [req.body.code]], (err, rows, fields) => {
            if (!err) {
                resolve(rows);
            } else {
                reject(err);
            }
        });
    });
}

router.post('/verifyCode',async (req, res) => {
    console.log(req.body)
    let result = await getCode(req, res); 

    if (result.length != 0) {
        let user = await getUserByEmail(req, res);
        console.log(user);
        return res.send({
            result: 1,
            message: "Code is correct",
            login: user[0].login
        });
    }
    else res.send({
        result: 0,
        message: "Code incorrect"
    })
});

router.get('/change-password', (req, res) => {   
    res.render('../Views/change-pass.twig');
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


async function updatePass (req, res) {
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    return new Promise((resolve, reject) => {
        database.query('UPDATE user SET password = ? WHERE login = ?', [hashedPwd, req.body.login], (err, rows, fields) => {
            if (!err) {
                console.log("Password updated successfully")
                resolve();
            } else {
                reject(err);
            }
        });
    });
}
router.post('/update-password',async (req, res) => {
    await updatePass(req, res)
    .then( () => {
        res.status(200).send();
    })
    .catch(err => console.log(err));
    
});
module.exports = router;