"use strict";

var Task = require('../models/task');
const Label = require('../models/label');
var User = require('../models/user')

function addTask(req, res) {
  var params = req.body;
  var task = new Task(params);

  if (params.name && params.description && params.deadline) {
    task.status = "TO DO";
    task.save((err, storedTask) => {
      if (err)
        return res.status(500).send({ message: "Error at saving task" });
      if (!storedTask) {
        return res
          .status(500)
          .send({ message: "Task could not be saved" });
      } else {
        return res.status(200).send({ task: storedTask });
      }
    });
    // Project.findById(idProject, (err, projectF) => {
    //   if (projectF) {
    //     if (projectF.projectOwner == idUser) {
          
    //     }
    //   } else {
    //     res.status(402).send({ message: 'Grande! No mandaste los campos requeridos.' });
    //   }
    // });
  }
}

function getTasksByOwnerName(req, res) {
  let ownerName = req.params.ownerName;
  
  if(ownerName != 'leonardo') {
    return res.status(404).send({ message: 'No existe el usuario' });
  }

  User.findOne({ username: ownerName }, (err, user) => {
    Task.find({ taskOwner: user._id }).exec((err, userTasks) => {
      console.log(userTasks.length)
      if (err) return res.status(500).send({ message: "Request error!" });
      if (!userTasks) {
        return res.status(500).send({ message: "No found tasks" });
      } else {
        return res.status(200).send({ tasks: userTasks });
      }
    });
  });
}

function getTasksByOwner(req, res) {
  let ownerId = req.params.ownerId;

  Task.find({ taskOwner: ownerId }).exec((err, userTasks) => {
    console.log(userTasks.length)
    if (err) return res.status(500).send({ message: "Request error!" });
    if (!userTasks) {
      return res.status(500).send({ message: "No found tasks" });
    } else {
      return res.status(200).send({ tasks: userTasks });
    }
  });
}

function getAllTasks(req, res) {
  var idUser = req.user.sub;
  var idProject = req.params.idProject;
  Task.find({ project: idProject, taskOwner: idUser }).exec(
    (err, tasksByProject) => {
      if (err) return res.status(500).send({ message: "Request error!" });
      if (!tasksByProject) {
        return res.status(500).send({ message: "No found tasks" });
      } else {
        return res.status(200).send({ tasks: tasksByProject });
      }
    }
  );
}

function getTasksByDate(req, res) {
  let idUser = req.user.sub;
  let date = req.params.date;
  let projectId = req.body.project;

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Request error!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId, deadline: date }).exec(
          (err, tasksByDate) => {
            if (err) return res.status(500).send({ message: "Request error!" });
            if (!tasksByDate) {
              return res.status(500).send({ message: "No found tasks" });
            } else {
              return res.status(200).send({ tasks: tasksByDate });
            }
          }
        );
      } else {
        console.log("The user is not part of the project.");
      }
    });
  });
}

function getTasksByStatus(req, res) {
  let idUser = req.user.sub;
  let status = req.params.status;
  let projectId = req.body.project;

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Request error!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId, status: status }).exec(
          (err, tasksByStatus) => {
            if (err) return res.status(500).send({ message: "Request error!" });
            if (!tasksByStatus) {
              return res.status(500).send({ message: "No found tasks" });
            } else {
              return res.status(200).send({ tasks: tasksByStatus });
            }
          }
        );
      } else {
        console.log("The user is not part of the project.");
      }
    });
  });
}

function getTasksByLabels(req, res) {
  let idUser = req.user.sub;
  let labels = req.params.labels;
  let projectId = req.body.project;

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Request error!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId, labels: labels }).exec(
          (err, tasksByLabel) => {
            if (err) return res.status(500).send({ message: "Request error!" });
            if (!tasksByLabel) {
              return res.status(500).send({ message: "No found tasks" });
            } else {
              return res.status(200).send({ tasks: tasksByLabel });
            }
          }
        );
      } else {
        console.log("The user is not part of the project.");
      }
    });
  });
}

function getPendingTasks(req, res) {
  let idUser = req.user.sub;
  let projectId = req.params.projectId;

  var pendingTasks = [];

  Project.findById(projectId, (err, dataProyect) => {
    if (err) return res.status(500).send({ message: "Request error!" });

    Team.findById(dataProyect.developerTeam, (err, dataTeam) => {
      if (`${dataTeam.integrants}`.includes(`${idUser}`)) {
        Task.find({ project: projectId }).exec((err, pendingTask) => {
          if (err) return res.status(500).send({ message: "Request error!" });
          if (!pendingTask) {
            return res.status(500).send({ message: "No found tasks" });
          } else {
            for (let i = 0; i < pendingTask.length; i++) {
              if (pendingTask[i].progress < 100) {
                pendingTasks.push(pendingTask[i]);
              }
            }
            return res.status(200).send({ tasks: pendingTasks });
          }
        });
      } else {
        console.log("The user is not part of the project.");
      }
    });
  });
}

function editTask(req, res) {
  let idTask = req.params.id;
  let params = req.body;

  Task.findByIdAndUpdate(idTask, params, { new: true }, (err, editedTask) => {
    if (err)
      return res.status(500).send({ message: "Failed to edit the task" });

    if (!editedTask) {
      return res.status(500).send({ message: "Task could not be edited" });
    } else {
      return res.status(200).send({ task: editedTask });
    }
  });
}

function deleteTask(req, res) {
  let idTask = req.params.id;

  Task.findByIdAndDelete(idTask, (err, deletedTask) => {
    if (err)
      return res.status(500).send({ message: "Failed to delete the task" });

    if (!deletedTask) {
      return res.status(500).send({ message: "Task could not be deleted" });
    } else {
      return res.status(200).send({ task: deletedTask });
    }
  });
}

function getTask(req, res){
  let idTask = req.params.id;

  Task.findOne({ _id : idTask }).exec((err, task) => {
      if (err) return res.status(500).send({ message: 'Request error!' });

      if (!task) {
          return res.status(500).send({ message: 'No found teams' });
      } else {
          return res.status(200).send({ tasks: task });
      }
  })
}

function getTasks(req, res){
  let idTask = req.params.id;

  Task.find({}).exec((err, tasks) => {
    if (err) return res.status(500).send({ message: 'Request error!' });

    return res.status(200).send({ tasks: tasks });
  })
}

module.exports = {
  addTask,
  getTask,
  getAllTasks,
  editTask,
  deleteTask,
  getTasksByOwner,
  getTasksByDate,
  getTasksByStatus,
  getTasksByLabels,
  getPendingTasks,
  getTasksByOwnerName,
  getTasks,
  editTask,
  deleteTask
};
