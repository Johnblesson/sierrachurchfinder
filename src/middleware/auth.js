function authenticate(req, res, next) {
    if (req.session.user) {
      // User is authenticated, allow them to proceed
      next();
    } else {
      // User is not authenticated, redirect them to the login page
      res.redirect('/forbidden');
    }
  }

  module.exports = authenticate;