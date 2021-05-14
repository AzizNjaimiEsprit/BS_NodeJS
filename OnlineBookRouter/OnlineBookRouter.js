const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const authController = require('../public/js/authConroller');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/BooksPDF/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({storage: storage})
var path = require('path');


router.post('/addBook/:bookId',upload.single('bookPDF'), (req, res) => {
    let filename = req.file.filename;
    database.query("insert into online_book values (null,?,?)",
        [
            filename,
            req.params.bookId

        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('ok' + data.insertId)
            }
        });
})
router.get('/getById/:onlineBookId',  (req, res) => {
    database.query("SELECT c.* , b.*, url from online_book join book b on online_book.book_id = b.id join category c on b.category_id = c.id WHERE b.id=?", [req.params.onlineBookId],  (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})

router.get('/getAll',  (req, res) => {
    database.query("SELECT c.* , b.*, url from online_book join book b on online_book.book_id = b.id join category c on b.category_id = c.id ",  (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})
router.post('/deleteOnlineBook', (req, res) => {
    database.query("delete from online_book where id = ? ",
        [
            req.body.onlineBookId,
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Online Book Deleted");
                else
                    res.send("No record found !!!")
            }
        });
})
router.get('/getBookPDF/:bookId', ((req, res) => {
    res.sendFile(path.resolve(__dirname + '/../uploads/BooksPDF/' + req.params.bookId+'.pdf'));
}))



module.exports = router;