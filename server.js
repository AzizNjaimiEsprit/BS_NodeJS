const express = require('express');
var cors = require('cors');
var path = require('path');
const app = express();
var bodyParser = require('body-parser')
const session = require('express-session');
const database = require('./config/db.config');
const authController = require('./public/js/authConroller');

///////////////////////////////////////////////////////////////////////////////
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ssshhhhh'}));
////////////////////////////////////////////////////////////////////////////

require('./CommandsRouter/index')(app);
require('./UserRouter/index')(app);
require('./BlogRouter/index')(app);
require('./BookRouter/index')(app);
require('./UserMainRouter/index')(app);
require('./OfferRouter/index')(app);
require('./CouponRouter/index')(app);
require('./OnlineBookRouter/index')(app);
require('./CategoryRouter/index')(app);
require('./LibraryRouter/index')(app);

app.get("/home",(req, res) => {
    database.query('SELECT book.*,c.name as cat FROM book join category c on c.id = book.category_id', (err, rows, fields) => {
        database.query('select category.name,count(b.id) as count from category left join book b on category.id = b.category_id group by category.name order by count desc', (err2, rows2, fields) => {
            database.query('SELECT *,p.id as blogId FROM post p join user u on p.publisher_id = u.id', (err3, rows3, fields) => {
                res.render('../Views/homePage.twig', {books: rows, categories: rows2,blogs : rows3, pageName: "Home"})
            })
        })
    })
})
app.get("/contact",(req, res) => {
    res.render('../Views/contact.twig', {pageName: "Contact Us"} )
})

app.use(function(req, res, next) {
    if (req.originalUrl == '/'){
        if (req.session.currentUser){
            res.redirect('/home');
        }else{
            res.redirect('/account/loginPage');
        }
    }else{
        res.render('../Views/error404.twig',{pageName : "404"})
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port ${port} active`));
