'use strict';

var Note = require('../models/note');

function addNote(req, res) {
    var idUser = req.user.sub;
    var params = req.body;
    var note = new Note();

    if (params.title) {
        note.title = params.title;
        note.content = params.content;
        note.deadline = params.deadline;
        note.owner = idUser;
        note.labels = params.labels;
        note.favorite = params.favorite;

        note.save((err, savedNote) => {
            if (err) {
                return res.status(500).send({ message: 'No se pudo guardar la nota, error del servidor.' })
            } else if (!savedNote) {
                return res.status(402).send({ message: 'No se pudo guardar la nota.' })
            } else {
                return res.status(200).send({ note: savedNote });
            }
        });
    } else {
        return res.status(400).send({ message: 'Datos incompletos para crear una nota.' });
    }
}

function getNote(req, res) {
    let noteId = req.params.id;

    Note.find({ _id: noteId }).exec((err, note) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor al buscar la nota.' });
        if (!note) {
            return res.status(402).send({ message: 'No se encontro la nota solicitada.' });
        } else {
            return res.status(200).send({ note });
        }
    });
}

function getAllNotes(req, res) {
    let ownerId = req.user.sub;

    Note.find({ owner: ownerId }).exec((err, notes) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor al buscar sus notas.' });
        if (!notes) {
            return res.status(402).send({ message: 'No se encontro ninguna nota, por favor agregue una. :D' });
        } else {
            return res.status(200).send({ notes });
        }
    });
}

function editNote(req, res) {
    let idNote = req.params.id;
    let params = req.body;

    Note.findByIdAndUpdate(idNote, params, { new: true }, (err, note) => {
        if (err)
            return res.status(500).send({ message: 'Error en el servidor al editar la nota.' });
        if (!note) {
            return res.status(402).send({ message: 'No se pudo editar la nota.' });
        } else {
            return res.status(200).send({ note });
        }
    });
}

function deleteNote(req, res) {
    let idNote = req.params.id;

    Note.findByIdAndDelete(idNote, (err, deleted) => {
        if (err)
            return res.status(500).send({ message: 'Error en el servidor al eliminar la nota solicitada.' });
        if (!deleted) {
            return res.status(402).send({ message: 'La nota no se pudo eliminar.' });
        } else {
            return res.status(200).send({ note: deleted });
        }
    });
}

function getNotesByLabel(req, res) {
    let idUser = req.user.sub;
    let labels = req.params.labels;
    let projectId = req.body.project;

    return res.status(400).send({ message: 'Funcion no implementada :( '})
}

module.exports = {
    addNote, getNote, getAllNotes, getNotesByLabel, editNote, deleteNote
};
