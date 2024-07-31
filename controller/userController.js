const userSchema = require("../model/userSchema");

exports.getUsers = (req, res, next) => {
  userSchema
    .find({})
    .populate("role")
    .select("-password")
    .then((users) => {
      if (!users.length) {
        res.status(404).json({ message: "there is no users" });
      }
      res.status(200).json({ users });
    })
    .catch((err) => next(err));
};

exports.addUser = (req, res, next) => {
  let object = new userSchema(req.body);

  object
    .save()
    .then(() => {
      res.status(200).json({ action: "user added successfully" });
    })
    .catch((err) => next(err));
};

exports.updateUser = (req, res, next) => {
  const { id } = req.body;
  const updateData = req.body;

  userSchema
    .findByIdAndUpdate(id, updateData, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

exports.deleteUser = (req, res, next) => {
  const { id } = req.params;

  userSchema
    .findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => next(err));
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  userSchema
    .findById(id)
    .populate("role")
    .select("-password") 
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
    })
    .catch((err) => next(err));
};
