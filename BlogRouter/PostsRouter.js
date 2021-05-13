const express = require('express');
const router = express.Router();
const database = require('../config/db.config');
const authController = require('../public/js/authConroller');
let yyyymmdd = require("yyyy-mm-dd");
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/BlogsImages/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })
var path = require('path');

router.get('/',authController,(req, res) => {
    database.query('SELECT *,p.id as blogId FROM post p join user u on p.publisher_id = u.id', (err, rows, fields) => {
        if (err) {
            res.render('../Views/blog.twig',{rows : [],pageName : "Blogs"})
        } else {
            res.render('../Views/blog.twig',{rows : rows,pageName : "Blogs"})
        }
    })
})

router.get('/blogDetails/:blogId',authController,(req, res) => {
    database.query('SELECT *,p.id as blogId FROM post p join user u on p.publisher_id = u.id where p.id=?',[req.params.blogId], (err, rows, fields) => {
        if (err || rows.length == 0) {
            res.render('../Views/blog-details.twig',{blog : [],pageName : "Blog Details"})
        } else {
            database.query('SELECT * FROM post_comment pc join user u on pc.publisher_id = u.id WHERE post_id = ?', [rows[0].blogId], (err, comments, fields) => {
                if (err || comments.length == 0) {
                    res.render('../Views/blog-details.twig',{blog : rows[0],comments : [],userId : req.session.currentUser.userId ,pageName : "Blog Details"})
                } else {
                    res.render('../Views/blog-details.twig',{blog : rows[0],comments : comments,userId : req.session.currentUser.userId,pageName : "Blog Details"})
                }
            })
        }
    })
})


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
    database.query('SELECT * FROM attachment WHERE post_id = ?', [req.params.postId], (err, rows, fields) => {
        if (err) {
            res.sendFile(path.resolve(__dirname+'/../uploads/no_image.png'));
        } else {
            if(rows.length == 0){
                res.sendFile(path.resolve(__dirname+'/../uploads/no_image.png'));
            }
            else
                res.sendFile(path.resolve(__dirname+'/../uploads/BlogsImages/'+rows[0].file_name));
            //res.send(rows)
        }
    })
}))

router.post('/add', (req, res) => {
    database.query("insert into post values (NULL,?,?,?,?)",
        [
            req.body.publisherId,
            yyyymmdd.withTime(),
            req.body.body,
            req.body.title,
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
    database.query("update post set body = ? and title = ? where id = ?",
        [
            req.body.body,
            req.body.title,
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
    database.query('SELECT *,p.id as blogId FROM post p join user u on p.publisher_id = u.id WHERE publisher_id = ?', [req.params.userId], (err, rows, fields) => {
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