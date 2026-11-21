const express = require("express");
const {
  register,
  logon,
  logoff,
  show,
} = require("../controllers/userController");
const { userSchema } = require("../validation/userSchema");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const router = express.Router();

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

router.post("/register", validateUser, register);
router.post("/logon", logon);
router.post("/logoff", jwtMiddleware, logoff);
router.get("/show/:id", jwtMiddleware, show);

module.exports = router;
