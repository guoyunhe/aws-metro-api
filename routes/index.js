const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

router.post("/register", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        return next(err);
      }

      passport.authenticate("local")(req, res, () => {
        req.session.save((err) => {
          if (err) {
            return next(err);
          }
          res.status(200).send(user);
        });
      });
    }
  );
});

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true }),
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(req.user);
    });
  }
);

router.get("/me", (req, res) => {
  res.status(200).json(req.user);
});

router.post("/logout", (req, res, next) => {
  req.logout({}, (err) => {
    if (err) {
      return next(err);
    }
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send();
    });
  });
});

module.exports = router;
