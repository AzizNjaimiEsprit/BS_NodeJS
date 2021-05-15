const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const multer = require('multer');
const fs = require('fs');

const functions = require('./Utilities/functions');

const path = require('path');
/*onst uploader = multer({
    dest: "C:/Users/mariahi/Desktop/Projects/Esprit/BooksCovers"
}); */

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "uploads/offersBooksImages/")
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const uploader = multer({storage: storage}).array('files', 4); 
router.post('/addOffer', (req, res) => {
    // Save offer images
    uploader(req, res, function(err) {
        console.log(req.body);
        if (err) {
            return res.send("Something went wrong");
        }
        else {
            // Add Offer details to database
            database.query('INSERT INTO offers VALUES (NULL,?,?,?,?,?,?,?)', [
                req.body.author,
                req.body.description,
                functions.composeImagePaths(req.files),
                parseFloat(req.body.price.replace(",", ".")),
                "not bought",
                req.body.title,
                req.body.userId,
            ], (err, rows, fields) => {
                if (!err) res.send({
                    status: 1,
                    message: 'Your offer is saved'
                });
                else res.send({
                    status: 0,
                    message: 'An error occured while saving your offer please try again later'
                });;
            });
        }
    });
    
});
    
router.get('/add', (req, res) => {
    if (req.session.currentUser) res.render('../Views/offer.twig');
    else res.redirect('/account');
    
});
// Update existing offers

router.post('/update/:offerId', (req, res) => {
    
    uploader(req, res, function(err) {
        if (err) {
            return res.send("Something went wrong");
        }
        else {
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
                functions.composeImagePaths(req.files),
                req.body.price,
                req.body.status,
                req.body.title,
                req.body.userId,
                req.params.offerId
            ], (err, rows, fields) => {
                if (!err) res.send('Offer updated successfuly');
                else res.send('Updating offer failed');
            });
        }
    });

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

router.get('/get/', (req, res) => {
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