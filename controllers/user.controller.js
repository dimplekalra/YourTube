const User = require("../models/user.model");
const _ = require("lodash");
const errorHandler = require("../helpers/dbErrorHandler");

const create = (req, res, next) => {
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        message: errorHandler.getErrorMessage(err),
      });
    }
    res.status(200).json({
      message: "Successfully signed up!",
    });
  });
};

const list = (req, res) => {
  return User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        message: errorHandler.getErrorMessage(err),
      });
    }
    return res.status(200).json(users);
  }).select("name email createdOn updatedOn");
};

const userById = (req, res, next, id) => {
  return User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    req.profile = user;
    next();
  });
};

const read = (req, res) => {
  req.profile.password = undefined;

  return res.json(req.profile);
};

const update = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body);

  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        message: errorHandler.getErrorMessage(err),
      });
    }

    

    return res.json(user);
  });
};

const remove = (req, res, next) => {
  let user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        message: errorHandler.getErrorMessage(err),
      });
    }

    res.json(deletedUser);
  });
};

module.exports = { create, userById, read, list, remove, update };
