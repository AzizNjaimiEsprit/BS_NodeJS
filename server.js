const express = require('express');
var cors = require('cors');
var path = require('path');
const app = express();
const session = require('express-session');
app.use(cors());
var bodyParser = require('body-parser')
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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Port ${port} active`));