let adminRoutes = ['ordersList']

function isAuthenticated(req, res, next) {

    if (req.session.currentUser){
        if(true){ //adminCheck
            return next();
        }

    }else{
        res.redirect('/account/loginPage');
    }
}

module.exports = isAuthenticated;
