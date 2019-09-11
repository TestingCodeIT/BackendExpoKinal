"user strict";

var Label = require("../models/label");

function createLabel(req,res) {
    var params=req.body;
    var label= new Label(params);
    if(params.name){
        label.save((err,labelCreated)=>{
            if(err) return res.status(500).send({message:'Request Error'});
            if(!labelCreated) return res.status(404).send({message:'Could not create a label'});
            return res.status(200).send({label:labelCreated});
        })
    }
}

function editLabel(req, res) {
  var labelId = req.params.id;
  var params = req.body;
  Label.findByIdAndUpdate(
    labelId,
    params,
    { new: true },
    (err, labelUpdated) => {
      if (err) return res.status(500).send({ message: "Request Error" });
      if (!labelUpdated)
        return res.status(404).send({ message: "Could not update the label" });
      return res.status(200).send({ label: labelUpdated });
    }
  );
}

function deleteLabel(req, res) {
  var labelId = req.params.id;
  Label.findByIdAndRemove(labelId, (err, labelDeleted) => {
    if (err) return res.status(500).send({ message: "Request Error" });
    if (!labelDeleted)
      return res.status(404).send({ message: "Could not delete the label" });
    if (labelDeleted) {
      return res.status(200).send({ message: "Label deleted successfully" });
    }
  });
}

function getLabels(req, res) {
  Label.find((err, labels) => {
    if (err) return res.status(500).send({ message: "Request Error" });
    if (!labels)
      return res.status(404).send({ message: "Could not read the labels" });
    return res.status(200).send({ labels: labels });
  });
}

module.exports = {
  createLabel,
  editLabel,
  deleteLabel,
  getLabels
};
