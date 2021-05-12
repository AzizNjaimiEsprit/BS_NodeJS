const express = require('express');
var cors = require('cors');
var path = require('path');
const app = express();
var bodyParser = require('body-parser')
const session = require('express-session');
const database = require('./config/db.config');
///////////////////////////////////////////////////////////////////////////////
app.use(cors());
app.use(bodyParser.json())
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
app.get("/home",(req, res) => {
    database.query('SELECT book.*,c.name FROM book join category c on c.id = book.category_id',
        (err, rows, fields) => {
        database.query('select category.name,count(b.id) as count from category left join book b on category.id = b.category_id group by category.name order by count desc',
            (err2, rows2, fields) => {
                res.render('../Views/homePage.twig', {books: rows, categories: rows2, pageName: "Home"})
            })
    })
})

app.use(function(req, res, next) {
    res.render('../Views/error404.twig',{pageName : "404"})
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port ${port} active`));
