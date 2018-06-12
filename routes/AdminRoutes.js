module.exports = app => {
  app.get("/admin/sign-up", (req, res, next) => {
    return res.render("admin/signup");
  });
};
