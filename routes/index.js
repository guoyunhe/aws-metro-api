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
        return res.render("register", { error: err.message });
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
      res.status(200).send(user);
    });
  }
);

router.get("/me", (req, res) => {
  res.status(200).send(req.user);
});

router.get("/logout", (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send();
  });
});

module.exports = router;
