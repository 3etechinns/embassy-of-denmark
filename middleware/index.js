const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  return next();
};

const requireLogout = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/history");
  }
  return next();
};

module.exports = {
  requireLogin,
  requireLogout
};
