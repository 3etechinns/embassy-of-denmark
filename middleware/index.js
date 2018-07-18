const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  return next();
};

const requireLogout = (req, res, next) => {
  if (req.session.userId && req.session.isAdmin) {
    return res.redirect("/admin");
  } else if (req.session.userId) {
    return res.redirect("/profile");
  }
  return next();
};

module.exports = {
  requireLogin,
  requireLogout
};
