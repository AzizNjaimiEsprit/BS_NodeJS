const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const multer = require('multer');
const fs = require('fs');

const functions = require('./Utilities/functions');

const path = require('path');
const { Client } = require('twilio/lib/twiml/VoiceResponse');
const { client } = require('../SMS-Service/twilio');
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
                else console.error(err);
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

router.get('/getAllOffers/', (req, res) => {
    if (req.session.currentUser.role == 0) res.status(400).redirect('/offers/add');
    else {
        database.query('select o.*, u.full_name, u.telephone as phone from offers o join user u on o.user_id = u.id order by id desc;',  (err, rows) => {
            if (!err) {
                
                res.render('../Views/List-of-offers.twig', {offers: rows});
            }
            else res.status(400).send('Operation failed');
        });
    }
});

router.get('/getOfferImage/:image', (req, res) => {
    try{
        res.sendFile(path.resolve(__dirname + '/../uploads/offersBooksImages/' + req.params.image));
    }catch (ex){
        res.sendFile(path.resolve(__dirname + '/../uploads/BooksImage/unfound.jpg'));
    }
});

router.get('/getOffer/:offerId', (req, res) => {
    database.query('select o.*, u.full_name, u.telephone as phone from offers o join user u on o.user_id = u.id and o.id = ?', [req.params.offerId], (err, data) => {
        if (!err) {
            
            res.render('../Views/offerDetails.twig', {offer: data[0]});
        }
        else res.status(400).send("Error happened try later");
    });
});

router.post('/acceptOffer', (req, res) => {
    database.query('UPDATE offers SET status = ? WHERE id = ?', ['yes', req.body.offerId], (err, rows) => {
        if (!err) {
            const data = {
                userId: req.body.userId,
                amount: req.body.price
            };
            request.post('http://localhost:5000/coupon/add', {json: data}, (err, result) => {
                if (err) {
                    console.error(err);
                    return
                }
                console.log(result.body.coupon);
                client.messages.create({
                    body: "Hello " + req.body.name + " this is the administration of bookstore.\nWe want to inform you that your offer has been accepted.\nYou can use the coupon code that you will find in this message in your next purshases from our store.\nYour coupon : " + result.body.coupon + "\nAmount : " + req.body.price + " TND\nWe are looking forward for more business with you.",
                    from: '+19548665336',
                    to: '+216' + req.body.phone
                }).then(message => console.log(message))
                .done();
            });
            res.status(200).send({result: 1});
        }
        else {
            console.error(err);
            res.send({result: 0});
        }
    });
})

router.post('/declineOffer', (req, res) => {
    console.log('endpoint');
    database.query('UPDATE offers SET status = ? WHERE id = ?', ['no', req.body.offerId], (err, rows) => {
        if (!err) {
            
            res.send({result: 1});
        }
        else {
            console.error(err);
            res.send({result: 0});
        }
    });
})

// Delete an offer from database

router.get('/delete/:offerId', (req, res) => {
    database.query('DELETE FROM offers WHERE id = ?', [req.params.offerId], (err, rows) => {
        if (!err) res.send('Offer deleted successfuly');
        else res.send('Offer Deleting failed');
    })
});

module.exports = router;