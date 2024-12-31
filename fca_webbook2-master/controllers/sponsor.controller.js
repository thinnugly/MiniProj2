const Sponsor = require('../models/sponsor.model');
const { validationResult } = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");
const SponsorAnimal = require('../models/sponsoranimal.model');

exports.get = (req, res) => {
    Sponsor.find(req.query).exec((error, sponsors) => {
        if (error) throw error;

        let message = SponsorMessages.success.s2;

        if (sponsors.length <= 0)
            message = SponsorMessages.success.s5;

        message.body = sponsors;
        return res.status(message.http).send(message);
    });
}

exports.create = async (req, res) => {
    try {
      const errors = validationResult(req).array();
      if (errors.length > 0) return res.status(406).send(errors);
  
      const existingSponsor = await Sponsor.findOne({ name: req.body.name });
      if (existingSponsor) {
        return res.status(409).send({
          http: 409,
          message: 'Já existe um patrocinador com este nome.',
        });
      }
  
      const sponsor = new Sponsor({
        name: req.body.name,
        organization: req.body.organization,
        sponsorship_value: req.body.sponsorship_value,
        contact: req.body.contact,
        notes: req.body.notes,
      });
  
      const savedSponsor = await sponsor.save();
  
      let message = SponsorMessages.success.s0;
      message.body = savedSponsor;
      return res
        .header('location', '/sponsors/' + savedSponsor._id)
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

    Sponsor.findOne({ name: req.body.name, _id: { $ne: req.params.id } }, (error, existingSponsor) => {
        if (error) throw error;

        if (existingSponsor) {
            return res.status(400).send({
                message: 'Já existe um patrocinador com este nome.'
            });
        }

        Sponsor.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true },
            (error, sponsor) => {
                if (error) throw error;
                if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);

                let message = SponsorMessages.success.s1;
                message.body = sponsor;
                return res.status(message.http).send(message);
            }
        );
    });
};


exports.delete = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const associatedSponsor = await SponsorAnimal.findOne({ sponsor_id: req.params.id });
        if (associatedSponsor) {
            return res.status(400).send({
                message: 'Este patrocinador ainda está associado a um animal e não pode ser excluído.',
            });
        }

        const result = await Sponsor.deleteOne({ _id: req.params.id });
        if (result.deletedCount <= 0) {
            return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        }

        return res.status(SponsorMessages.success.s3.http).send(SponsorMessages.success.s3);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Ocorreu um erro no servidor.' });
    }
};


exports.getOne = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOne({
        _id: req.params.id
    }).exec((error, sponsor) => {
        if (error) throw error;
        if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);

        let message = SponsorMessages.success.s2;
        message.body = sponsor;
        return res.status(message.http).send(message);
    });
}

exports.activate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: true
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s6.http).send(SponsorMessages.success.s6);
    });
}

exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: false
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s4.http).send(SponsorMessages.success.s4);
    });
}
  
