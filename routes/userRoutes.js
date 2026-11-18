const express = require("express");
const {
  register,
  logon,
  logoff,
  show,
} = require("../controllers/userController");
const { userSchema } = require("../validation/userSchema");
const authMiddleware = require("../middleware/auth");

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
router.post("/logoff", logoff);
router.get("/show/:id", authMiddleware, show);

module.exports = router;
