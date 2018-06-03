const handlePayment = (req, res, next) => {
  console.log(req.body);
  return res.json({ message: "ok" });
};

module.exports = {
  handlePayment
};
