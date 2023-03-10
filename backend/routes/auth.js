const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = 5;
    const hashedPass = await bcrypt.hash(req.body.password, 5);
    console.log(req.body)
     const newUser =  new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user) {
      res.status(400).json("Wrong credentials!");
      return;
    } 

    const validated = await bcrypt.compare(req.body.password, user.password);
    if(!validated ) {
      res.status(400).json("Wrong Password!, Please try again.");
      return;
    } 
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;