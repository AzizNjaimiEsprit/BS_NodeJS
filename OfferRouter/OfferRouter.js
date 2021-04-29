const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;



// Add new offer
router.post('/add', (req, res) => {
    const twiml = new MessagingResponse();
    if (req.body.NumMedia !== 0) {
        const filename = `${req.body.imageUrl}.png`;
        const url = req.body.MediaUrl0;
        request(url).pipe(fs.createWriteStream('../images/' + filename))
        .on('close', () => console.log('Image downloaded.'));
        twiml.message('Image received and downloaded in the server');
    } else {
        twiml.message('No image received');
    }

    res.send(twiml.toString());

    database.query('INSERT INTO offers VALUES (NULL,?,?,?,?,?,?,?)', [
        req.body.author,
        req.body.description,
        req.body.imageUrl,
        req.body.price,
        req.body.status,
        req.body.title,
        req.body.userId,
    ], (err, rows, fields) => {
        if (!err) res.send('Offer added successfuly');
        else res.send('Adding offer failed');
    })
});

// Update existing offers

router.post('/update/:offerId', (req, res) => {
    
    database.query(`UPDATE user SET author = ?,
                                    description = ?,
                                    image = ?,
                                    price = ?,
                                    status = ?,
                                    title = ?,
                                    user_id = ?,
                                WHERE id = ?`
    , [
        req.body.author,
        req.body.description,
        req.body.imageUrl,
        req.body.price,
        req.body.status,
        req.body.title,
        req.body.userId,
        req.params.offerId
    ], (err, rows, fields) => {
        if (!err) res.send('Offer updated successfuly');
        else res.send('Updating offer failed');
    })
});


// Get offer by id

router.get('/get/:offerId', (req, res) => {
    database.query('SELECT * FROM offers WHERE id = ?', [req.params.offerId], (err, rows) => {
        if (!err) {
            if (rows.length > 0) res.send(rows);
            else res.send('There is no offer with such id');
        }
        else res.send('Operation failed');
    });
});


// Get list of offers

router.get('/get/:offerId', (req, res) => {
    database.query('SELECT * FROM offers',  (err, rows) => {
        if (!err) {
            if (rows.length > 0) res.send(rows);
            else res.send('There is no offers');
        }
        else res.send('Operation failed');
    });
});

// Delete an offer from database

router.get('/delete/:offerId', (req, res) => {
    database.query('DELETE FROM offers WHERE id = ?', [req.params.offerId], (err, rows) => {
        if (!err) res.send('Offer deleted successfuly');
        else res.send('Offer Deleting failed');
    })
});7

module.exports = router;