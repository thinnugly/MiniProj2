const Expert = require('../models/expert.model');
const { validationResult } = require('express-validator');
const ExpertMessages = require("../messages/expert.messages");
const ExpertAnimal = require('../models/expertanimal.model');

exports.get = (req, res) => {
    Expert.find(req.query).exec((error, experts) => {
        if (error) throw error;

        let message = ExpertMessages.success.s2;

        if (experts.length <= 0)
            message = ExpertMessages.success.s5;

        message.body = experts;
        return res.status(message.http).send(message);
    });
}

exports.create = async (req, res) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) return res.status(406).send(errors);
  
      const existingExpert = await Expert.findOne({ name: req.body.name });
      if (existingExpert) {
        return res.status(409).send({
          http: 409,
          message: 'Já existe um especialista com este nome.',
        });
      }
  
      const expert = new Expert({
        name: req.body.name,
        institution: req.body.institution,
        areas_expertise: req.body.areas_expertise,
        contacto: req.body.contacto,
        notes: req.body.notes,
      });
  
      const savedExpert = await expert.save();
  
      let message = ExpertMessages.success.s0;
      message.body = savedExpert;
      return res
        .header('location', '/experts/' + savedExpert._id)
        .status(message.http)
        .send(message);
    } catch (error) {
      return res.status(500).send({
        http: 500,
        message: 'Erro ao criar patrocinador.',
        error: error.message,
      });
    }
  };
  
  exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);
  
    Expert.findOne({ name: req.body.name, _id: { $ne: req.params.id } }, (error, existingExpert) => {
      if (error) throw error;
  
      if (existingExpert) {
        return res.status(400).send({
          message: 'Já existe um especialista com este nome.',
        });
      }
  
      Expert.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true },
        (error, expert) => {
          if (error) throw error;
          if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
  
          let message = ExpertMessages.success.s1;
          message.body = expert;
          return res.status(message.http).send(message);
        }
      );
    });
  };
  

  exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);
  
    try {
      const associatedExpert = await ExpertAnimal.findOne({ expert_id: req.params.id });
      if (associatedExpert) {
        return res.status(400).send({
          message: 'Este especialista ainda está associado a um animal e não pode ser excluído.',
        });
      }
  
      const result = await Expert.deleteOne({ _id: req.params.id });
      if (result.deletedCount <= 0) {
        return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
      }
  
      return res.status(ExpertMessages.success.s3.http).send(ExpertMessages.success.s3);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Ocorreu um erro no servidor.' });
    }
  };
  

exports.getOne = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.findOne({
        _id: req.params.id
    }).exec((error, expert) => {
        if (error) throw error;
        if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);

        let message = ExpertMessages.success.s2;
        message.body = expert;
        return res.status(message.http).send(message);
    });
}

exports.activate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: true
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(ExpertMessages.success.s6.http).send(ExpertMessages.success.s6);
    });
}

exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: false
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(ExpertMessages.success.s4.http).send(ExpertMessages.success.s4);
    });
}
