const express = require('express');
const router = express.Router();
const database = require('../config/db.config');

var path = require('path');
const authController = require('../public/js/authConroller');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/BooksImage/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({storage: storage})
router.post('/addBook'/*,authController*/, (req, res) => {
    database.query("insert into book values (null,?,?,?,?,?,?,?,?,'xxxx',?,?)",
        [
            req.body.title,
            req.body.price,
            req.body.pub_house,
            req.body.summary,
            req.body.release_date,
            req.body.quantity,
            req.body.status,
            req.body.category_id,
            req.body.nb_page,
            req.body.author,
        ],
        function (err, data) {
            if (err) {
                res.json({msg:"fail",error:err});
            } else {
                res.json({msg: 'ok', insertId: data.insertId})
            }
        });
})
router.get('/getById/:bookId', (req, res) => {
    database.query('SELECT * FROM book WHERE id = ?', [req.params.bookId], (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})

router.get('/getAll', (req, res) => {
    database.query('SELECT * FROM book ', (err, rows, fields) => {
        if (err) {
            res.send(err);
        } else {
            res.send(rows)
        }
    })
})
router.post('/deleteBook', (req, res) => {
    database.query("delete from book where id = ? ",
        [
            req.body.bookId,
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
router.get('/bookDetails/:bookId', (req, res) => {
    database.query('SELECT *,b.id as bookId from book b join category c on b.category_id = c.id WHERE b.id = ?', [req.params.bookId], (err, rows, fields) => {
        database.query('select category.name,count(b.id) as count from category left join book b on category.id = b.category_id group by category.name order by count desc', (err2, rows2, fields) => {
            database.query('SELECT * FROM comment join user u on comment.user_id = u.id WHERE book_id = ?', [req.params.bookId], (err3, rows3, fields) => {
                console.log(rows3)
                res.render('../Views/single-product.twig', {book: rows[0], categories: rows2,comments:rows3, pageName: "Book details"})
            })
        })
    })
})


router.get('/getBookImage/:image', ((req, res) => {
    try{
        res.sendFile(path.resolve(__dirname + '/../uploads/BooksImage/' + req.params.image));
    }catch (ex){
        res.sendFile(path.resolve(__dirname + '/../uploads/BooksImage/unfound.jpg'));
    }


}))
router.get('/', (req, res) => {
    database.query('SELECT book.*,c.name FROM book join category c on c.id = book.category_id', (err, rows, fields) => {
        database.query('select category.name,count(b.id) as count from category left join book b on category.id = b.category_id group by category.name order by count desc',
            (err2, rows2, fields) => {
                res.render('../Views/shop-grid.twig', {books: rows, categories: rows2, pageName: "Shop"})
            })
    })
})
router.get('/library', (req, res) => {
    database.query('SELECT * from library l join book b on l.book_id = b.id WHERE user_id = ?', 3, (err, rows, fields) => {
        if (err) {
            res.render('../Views/library.twig', {books: []})
        } else {
            res.render('../Views/library.twig', {books: rows})
        }
    })
})

router.get('/booksList', (req, res) => {
    database.query('SELECT b.id as idBook ,c.* , b.*, url from online_book right join book b on online_book.book_id = b.id join category c on b.category_id = c.id  ', (err, rows, fields) => {
        if (err) {
            res.render('../Views/adminBookList.twig', {books: []})
        } else {
            res.render('../Views/adminBookList.twig', {books: rows,pageName: "Add Book"})
        }
    })
})
router.post('/updateImage/:bookId', upload.single('bookImage'), (req, res) => {
    let filename = req.file.filename;
    database.query("update book set image = ? where id = ?",
        [
            filename,
            req.params.bookId
        ],
        function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send('ok' )
            }
        });
})
router.get('/adminAddBook', (req, res) => {
    database.query('SELECT * FROM category', (err, rows, fields) => {
        if (err) {
            res.render('../Views/adminAddBook.twig', {categories: []})
        } else {
            res.render('../Views/adminAddBook.twig', {categories: rows , pageName :"Add Book"})
        }
    })
})

module.exports = router;