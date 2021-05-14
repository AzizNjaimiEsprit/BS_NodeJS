'use strict';
const mysql = require('mysql');
//local mysql db connection
const dbConn = mysql.createConnection({
    host: 'bosp87eso7g9qoiqeltj-mysql.services.clever-cloud.com',
    user: 'ufwcrzhlecbvqmn5',
    password: 'lFBBoU6swhBLissd766v',
    database: 'bosp87eso7g9qoiqeltj'
});
dbConn.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});
module.exports = dbConn;
