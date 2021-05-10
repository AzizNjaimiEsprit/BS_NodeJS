const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");
const stripe = require('stripe')('sk_test_51HoQVOCdaXOAG894ZbeM7FA6uSddSe14xHwkDQSl50ei8Lb6wm4yYNqfZJNLitwTdjNJnF6PlK40WSh6yXjnTSRB00LipmMa21');

router.get('/checkBalance/:totalPrice',(req, res) => {
    stripe.balance.retrieve(function(err, balance) {
        // asynchronously called
        console.log(Number(req.params.totalPrice))
        console.log(Number(balance.available[0].amount))
        Number(req.params.totalPrice) <= Number(balance.available[0].amount) ? res.send("true") : res.send("false")
    })
})

router.post('/checkCredentials',async (req, res) => {
    console.log(req.body)
    const card = await stripe.customers.createSource(
        'cus_IT09Efs6T6RhyC',
        {source: 'tok_mastercard'}
    );
    let flag = true;
    if (card.exp_month != req.body.exp_month)
        flag = false;
    else if (card.exp_year != req.body.exp_year)
        flag = false;
    else if (card.last4 != req.body.cardNumber.substr(req.body.cardNumber.length - 4))
        flag = false;
    else {
        res.send("ok")
    }
    if (flag == false){
        res.send( "Wrong Credentials")
    }
})
module.exports = router;