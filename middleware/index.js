const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  return next();
};

const requireLogout = (req, res, next) => {
  if (req.session.userId) return res.redirect("/profile");
  return next();
};

const handlePayment = async (req, res, next) => {};

module.exports = {
  requireLogin,
  requireLogout
};
