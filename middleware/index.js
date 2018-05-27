const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  return next();
};

module.exports = {
  requireLogin
};
