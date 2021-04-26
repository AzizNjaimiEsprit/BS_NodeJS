const express = require('express');
const router = express.Router();
const database = require('../config/db.config');

router.post('/add' ,(req,res)=>{
    database.query("insert into wishlist values (?,?)", 
    [
        req.body.bookId,
        req.body.userId,
    ],
         function (err, data) {
        if(err) {
            res.send(err);
        }
        else{
            res.send('Inserted')
        }
    });
})


router.get('/user/get/:userId',(req, res) => {
    database.query('SELECT * FROM wishlist WHERE user_id = ?',[req.params.userId],async (err, rows, fields) => {
        if(err) {
            res.send(err);
        }
        else{
            res.send(rows)
        }
    })
})


router.post('/delete' ,(req,res)=>{
    database.query("delete from wishlist where user_id = ? and book_id = ?", 
    [
        req.body.userId,
        req.body.bookId
    ],
         function (err, data) {
        if(err) {
            res.send(err);
        }
        else{
            if (data.affectedRows == 1)
                res.send("Deleted");
            else
                res.send("No record found !!!")
        }
    });
})

module.exports = router;