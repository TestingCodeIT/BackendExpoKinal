"use strict";

var bcrypt = require("bcryptjs");
var jwt = require("../services/jwt");
var User = require("../models/user");
var path = require("path");
var fs = require("fs");

function signUp(req, res) {
  var params = req.body;
  var user = new User();

  if (params.name && params.username && params.email && params.password) {
    user.name = params.name;
    user.username = params.username;
    user.email = params.email;
    user.password = params.password;
    user.image = null;

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(params.password, salt, function(err, hash) {
        user.password = hash;

        user.save((err, storedUser) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Error in save request" });

          if (!storedUser) {
            return res
              .status(500)
              .send({ message: "User could not be stored" });
          } else {
            delete storedUser.password;
            return res.status(200).send({ user: storedUser });
          }
        });
      });
    });
  } else {
    return res
      .status(500)
      .send({ message: "You must fill all fields before saving" });
  }
}

/* function getUserId(req, res) {
  var name = 
} */

function login(req, res) {
  var params = req.body;
  var email = params.email;
  var password = params.password;

  User.findOne({ email: email }, (err, foundUser) => {
    if (err) return res.status(500).send({ message: "Error in request" });

    if (!foundUser) {
      return res.status(402).send({ message: "User not found" });
    } else {
      bcrypt.compare(password, foundUser.password, (err, check) => {
        if (!check) {
          return res.status(402).send({ message: "Wrong password" });
        } else {
          foundUser.password = undefined;
          return res
            .status(200)
            .send({ foundUser, token: jwt.createToken(foundUser) });
        }
      });
    }
  });
}

function getUser(req, res){
  let idUser = req.params.id;

  User.findOne({ _id : idUser }).exec((err, user) => {
      if (err) return res.status(500).send({ message: 'Request error!' });

      if (!user) {
          return res.status(500).send({ message: 'No found teams' });
      } else {
          return res.status(200).send({ users: user });
      }
  })
}

function editUser(req, res) {
  var userId = req.params.id;
  var params = req.body;

  if (req.user.sub != userId) {
    return res.status(500).send({ message: "No se puede editar al usuario" });
  }
  delete params.password;

  User.findByIdAndUpdate(
    userId,
    params,
    { new: true },
    (err, usuarioActualizado) => {
      if (err) return res.status(500).send({ message: "error en la peticion" });

      if (!usuarioActualizado)
        return res.status(404).send({
          message: "No se ha podido actualziar los datos del usuario"
        });
      usuarioActualizado.password = undefined;
      return res.status(200).send({ user: usuarioActualizado });
    }
  );
}

function deleteUser(req, res) {
  var userId = req.params.id;

  if (req.user.sub != userId) {
    return res.status(500).send({ message: "No se puede eliminar al usuario" });
  }

  User.findByIdAndRemove(userId, (err, usuarioEliminado) => {
    if (err) return res.status(500).send({ message: "Error en el servidor" });

    if (usuarioEliminado) {
      return res.status(200).send({
        user: usuarioEliminado
      });
    } else {
      return res.status(404).send({
        message: "No existe el usuario"
      });
    }
  });
}

function uploadImage(req, res) {
  var userId = req.params.id;
  if (req.files) {
    var file_path = req.files.image.path;
    console.log(file_path);

    var file_split = file_path.split("\\");
    console.log(file_split);

    var file_name = file_split[3];
    console.log(file_name);

    var ext_split = file_name.split(".");
    console.log(ext_split);

    var file_ext = ext_split[1];
    console.log(file_ext);

    if (
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg" ||
      file_ext == "gif"
    ) {
      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        { new: true },
        (err, usuarioActualizado) => {
          if (err)
            return res
              .status(500)
              .send({ message: " no se a podido actualizar el usuario" });

          if (!usuarioActualizado)
            return res.status(404).send({
              message: "error en los datos del usuario, no se pudo actualizar"
            });

          return res.status(200).send({ user: usuarioActualizado });
        }
      );
    } else {
      return removeFilesOfUploads(res, file_path, "extension no valida");
    }
  }
}

function removeFilesOfUploads(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(200).send({ message: message });
  });
}

function getImage(req, res) {
  var image_file = req.params.nameImage;
  var path_file = "./src/uploads/users/" + image_file;

  fs.exists(path_file, exists => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "no existe la imagen" });
    }
  });
}

function listUsers(req, res) {
  User.find({}).exec((err, userUsers) => {
      if (err) return res.status(500).send({ message: 'Request error!' });

      return res.status(200).send({ users: userUsers });
  })
}

module.exports = {
  signUp,
  login,
  getUser,
  editUser,
  deleteUser,
  uploadImage,
  getImage,
  listUsers
};
