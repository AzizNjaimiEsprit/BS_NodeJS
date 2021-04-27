const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
let yyyymmdd = require("yyyy-mm-dd");
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })
var path = require('path');

router.post('/addAttachment/:postId',upload.single('attachment'), function (req, res, next) {
    let filename = req.file.filename;
    database.query("insert into attachment values (?,?)",
        [
            filename,
            req.params.postId
        ],
        function (err, data) {
            if (err) {
                res.send("error" + err);
            } else {
                res.send('Saved Successfully' + data.insertId)
            }
        });
})

router.get('/getPostAttachment/:postId',((req, res) => {
    database.query('SELECT * FROM attachment WHERE post_id = ?', [req.params.postId], async (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            console.log(__dirname+'/../uploads/'+rows[0].file_name)
            res.sendFile(path.resolve(__dirname+'/../uploads/'+rows[0].file_name));
            //res.send(rows)
        }
    })
}))

router.post('/add', (req, res) => {
    database.query("insert into post values (NULL,?,?,?)",
        [
            req.body.publisherId,
            yyyymmdd.withTime(),
            req.body.body,
        ],
        function (err, data) {
            if (err) {
                res.send("error" + err);
            } else {
                res.send('Inserted' + data.insertId)
            }
        });
})

router.post('/update', (req, res) => {
    database.query("update post set body = ? where id = ?",
        [
            req.body.body,
            req.body.id,
        ],
        function (err, data) {
            if (err) {
                res.send("error" + err);
            } else {
                if (data.affectedRows == 1)
                    res.send("Updated");
                else
                    res.send("No record found !!!")
            }
        });
})

router.get('/user/get/:userId', (req, res) => {
    database.query('SELECT * FROM post WHERE publisher_id = ?', [req.params.userId], async (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})


router.get('/delete/:id', (req, res) => {
    database.query("delete from post where id = ?",
        [
            req.params.id
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