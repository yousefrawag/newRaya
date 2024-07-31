const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  userSchema
    .findOne({ email: req.body.email })
    .populate("role")
    .then((user) => {
      if (!user) throw new Error("User doesn't exist");
      bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (!result) throw new Error("Invalid Password");
          let token = jwt.sign(
            {
              id: user._id,
              type: user.type,
              role: user.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "14d" }
          );
          res.status(200).json({ action: "Authenticated", token });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
