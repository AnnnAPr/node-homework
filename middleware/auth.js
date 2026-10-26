module.exports = (req, res, next) => {
  if (!global.user_id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  req.user = global.user_id;
  next();
};