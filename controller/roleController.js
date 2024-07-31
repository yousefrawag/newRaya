const roleSchema = require("../model/roleSchema");

exports.getAllRoles = (req, res, next) => {
  roleSchema
    .find({})
    .then((roles) => {
      res.status(200).json(roles);
    })
    .catch((err) => next(err));
};

exports.addRole = (req, res, next) => {
  let role = new roleSchema(req.body);
  role
    .save()
    .then(() => {
      res.status(201).json({ message: "Role created successfully" });
    })
    .catch((err) => next(err));
};

exports.getRoleById = (req, res, next) => {
  const id = req.params.id;

  roleSchema
    .findById(id)
    .then((role) => {
      if (!role) {
        return res.status(404).json({ message: "Role doesn't exist" });
      }
      res.status(200).json(role);
    })
    .catch((err) => next(err));
};
exports.updateRole = (req, res, next) => {
  const { id } = req.body;
  const updateData = req.body;

  roleSchema
    .findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedRole) => {
      if (!updatedRole) {
        return res.status(404).json({ message: "Role doesn't exist" });
      }
      res.status(200).json(updatedRole);
    })
    .catch((err) => next(err));
};

exports.deleteRole = (req, res, next) => {
  const id = req.params.id;

  roleSchema
    .findByIdAndDelete(id)
    .then((deletedRole) => {
      if (!deletedRole) {
        return res.status(404).json({ message: "Role doesn't exist" });
      }
      res.status(200).json({ message: "Role deleted successfully" });
    })
    .catch((err) => next(err));
};
