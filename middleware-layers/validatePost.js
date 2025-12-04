export function attachUserToLocals(req, res, next) {
    console.log("attachUserToLocals:", req.user);
    res.locals.user = req.user || null; 
    next();
}

export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login_form");
}