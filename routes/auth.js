const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
 
 const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json("User already exists" );
  }
  req.body.password = CryptoJS.AES.encrypt(
    req.body.password,
    process.env.PASS_SEC
  ).toString();
  const newUser = await User.create(req.body);
  
  res.status(200).json(newUser);
}
);


//LOGIN
router.post('/login', async (req, res) => {
try{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }
  const decryptedPass = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASS_SEC
  ).toString(CryptoJS.enc.Utf8);
  if (decryptedPass !== password) {
    return res.status(400).json({ msg: "Incorrect password" });
  }
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, {
    expiresIn: "3 days",
  });
  res.status(200).json({ accessToken, user: { id: user._id, isAdmin: user.isAdmin, email: user.email } });
} catch (err) {
  return res.status(500).json({ msg: 'Invalid or expired token' });
}

});

module.exports = router;
