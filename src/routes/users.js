const express = require("express");
const passport = require('passport');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const User = require('../models/user');

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post(
  "/signup",
  body('name').notEmpty().withMessage('Name can\'t be empty'),
  body('surname').notEmpty().withMessage('Surname can\'t be empty'),
  body('username').notEmpty().withMessage('Username can\'t be empty').bail().isLength({ min: 5, max: 20 }).withMessage('Please, introduce a valid username'),
  body('email').notEmpty().withMessage('Email can\'t be empty').bail().isEmail().withMessage('Please, insert a valid email').custom(async (value) => {
      // Check if email is already in use
      const user = await User.findOne({ email: value });
      if(user) {
          return Promise.reject('Email already in use');
      }
  }),
  body('password').notEmpty().withMessage('Password can\'t be empty').bail().isLength({ min: 8 }).withMessage('Please, introduce a valid password'),
  body('confirm-password').notEmpty().withMessage('Confirm password field can\'t be empty').bail().custom((value, { req }) => {
      // Check password matches password confirmation
      if(value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
      }
      return true;
  }),
  async (req, res) => {
    const { name, surname, username, email, phone, password } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('users/signup', { errors, name, surname, username, email, phone });
    }

    const user = new User({ name, surname, username, email, phone, password });
    user.password = await user.encryptPassword(password);
    await user.save();

    res.redirect('/users/signin');
  }
  );

router.get("/signin", (req, res) => {
  res.render("users/signin");
});

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/contacts',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

router.get('/logout', (req, res) => {
  req.logOut(),
  res.redirect('/')
});


module.exports = router;
