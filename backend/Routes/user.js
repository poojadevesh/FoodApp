const express = require("express");
const router = express();
const user = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/createUser", async (req, res) => {
  const { name, location, email, password, date } = req.body;
  console.log(name, location, email, password, date); // check input values

  const hashPassword = await bcrypt.hash(password, 10);
  const newuser = await user({
    name,
    location,
    email,
    password:hashPassword,
    date,
  });
 
  newuser
    .save()
    .then(async (data) => {
      res.json({ status: 200, data });
    })
    .catch((err) => {
      res.json({ status: 500 });
      console.log(err);
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if user exists
      const User = await user.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, User.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Create and sign JWT token
      const token = jwt.sign({ userId: user._id }, "poojaDevesh", {
        
      });

      res.status(200).json({ success:true, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });



module.exports = router;
