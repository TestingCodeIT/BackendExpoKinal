"use strict";

var Team = require("../models/team");

function createTeam(req, res) {
  var params = req.body;
  var team = new Team(params);
  // var ManagerId = req.user.sub;

  if (params.name) {

      Team.find({
          $and: [
              { 'name': params.name }
          ]
      }).exec((err, teams) => {
          if (err) return res.status(500).send({ message: 'Error at searching teams' });

          if (teams.length > 0) {
              return res.status(500).send({ message: 'You already have a team with that name' });
          } else {
              team.save((err, storedTeam) => {
                  if (err) return res.status(500).send({ message: 'Error at saving team' });

                  if (!storedTeam) {
                      return res.status(500).send({ message: 'Team could not be saved' });
                  } else {
                      return res.status(200).send({ team: storedTeam });
                  }
              });
          }
    });
  }
}

function getTeam(req, res){
    let idUser = req.params.id;

    Team.findOne({ _id : idUser }).exec((err, userTeams) => {
        if (err) return res.status(500).send({ message: 'Request error!' });

        if (!userTeams) {
            return res.status(500).send({ message: 'No found teams' });
        } else {
            return res.status(200).send({ teams: userTeams });
        }
    })
}

function editTeam(req, res){
    let idTeam = req.params.id;
    let params = req.body;

    Team.findByIdAndUpdate(idTeam, params, {new : true}, (err, editedTeam) => {
        if (err) return res.status(500).send({ message: 'Failed to edit the team', error: err });

        if (!editedTeam) {
            return res.status(500).send({ message: 'Team could not be edited' });
        } else {
            return res.status(200).send({ team: editedTeam });
        }
    });
}

function deleteTeam(req, res) {
  var teamId = req.params.teamId;
  var ManagerId = req.user.sub;

  Team.findById(teamId).exec((err, foundTeam) => {
    if (err)
      return res.status(500).send({ message: "Error at searching teams" });

    if (!foundTeam) {
      return res.status(500).send({ message: "Team not found" });
    } else {
      if (foundTeam.teamManager == ManagerId) {
        Team.findByIdAndRemove(teamId, (err, updatedTeam) => {
          if (err)
            return res.status(500).send({ message: "Error at deleting team" });

          if (!updatedTeam) {
            return res
              .status(500)
              .send({ message: "Team could not be deleted" });
          } else {
            return res.status(200).send({ team: updatedTeam });
          }
        });
      }
    }
  });
}

function addIntegrant(req, res) {
  var teamId = req.params.teamId;
  var integrantId = req.params.integrantId;
  var estado = true;

  Team.findById(teamId).exec((err, foundTeam) => {
    if (err) return res.status(500).send({ message: 'Error at searching teams' });
    if (!foundTeam) {
        return res.status(500).send({ message: 'Team not found' });
    } else {
        if (true) {
            foundTeam.integrants.forEach(element => {
                if (element._id === integrantId) {
                    estado = false;
                    return res.status(500).send({ message: 'El usuario ya es integrante de este equipo.'})
                }
            });
            if (estado) {
                Team.findByIdAndUpdate(teamId, {
                    $addToSet: {
                        integrants: { 'user': integrantId, 'role': 'USER' }
                    }
                }, { new: true }, (err, updatedTeam) => {
                    if (err) return res.status(500).send({ message: 'Error at adding integrant' });

                    if (!updatedTeam) {
                        return res.status(500).send({ message: 'Integrant could not be added' });
                    } else {
                        return res.status(200).send({ team: updatedTeam });
                    }
                });
            }
        }
    }
  });
}

function removeIntegrant(req, res) {
  var teamId = req.params.teamId;
  var ManagerId = req.user.sub;
  var integranId = req.params.integrantId;

  Team.findById(teamId).exec((err, foundTeam) => {
    if (err)
      return res.status(500).send({ message: "Error at searching teams" });

    if (!foundTeam) {
      return res.status(500).send({ message: "Team not found" });
    } else {
      if (foundTeam.teamManager == ManagerId) {
        Team.findByIdAndUpdate(
          teamId,
          {
            $pull: { integrants: { _id: integranId } }
          },
          { new: true },
          (err, updatedTeam) => {
            if (err)
              return res
                .status(500)
                .send({ message: "Error at removing integrant" });

            if (!updatedTeam) {
              return res
                .status(500)
                .send({ message: "Integrant could not be removed" });
            } else {
              return res.status(200).send({ team: updatedTeam });
            }
          }
        );
      }
    }
  });
}

function listTeams(req, res) {
    Team.find({}).exec((err, userTeams) => {
        if (err) return res.status(500).send({ message: 'Request error!' });

        return res.status(200).send({ teams: userTeams });
    })
}

module.exports = {
    createTeam,
    addIntegrant,
    editTeam,
    removeIntegrant,
    deleteTeam,
    listTeams,
    getTeam
}
