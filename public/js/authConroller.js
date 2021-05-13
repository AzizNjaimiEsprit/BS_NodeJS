let adminRoutes = ['ordersList']

function isAuthenticated(req, res, next) {

    if (req.session.currentUser){
        if(true){ //adminCheck
            return next();
        }

    }


    res.redirect('/users/login/aziz');
}

module.exports = isAuthenticated;