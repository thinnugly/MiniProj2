const ExpertAnimal = require('../models/expertanimal.model')
const { validationResult } = require('express-validator');
const ExpertAnimalMessages = require('../messages/expertanimal.messages')


exports.get = (req, res) => {
    ExpertAnimal.find(req.query).exec((error, expertanimal) => {
        if (error) throw error;

        let message = ExpertAnimalMessages.success.s2;

        if (expertanimal.length <= 0)
            message = ExpertAnimalMessages.success.s5;

        message.body = expertanimal;
        return res.status(message.http).send(message);
    });
}

exports.create = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const existingExpertAnimal = await ExpertAnimal.findOne({
            expert_id: req.body.expert_id,
            animal_id: req.body.animal_id
        });

        if (existingExpertAnimal) {
            return res.status(409).send({
                message: "Este especialista já está associado a este animal."
            });
        }

        const newExpertAnimal = new ExpertAnimal({
            expert_id: req.body.expert_id,
            animal_id: req.body.animal_id,
            association_type: req.body.association_type,
            notes: req.body.notes
        });

        const expertanimal = await newExpertAnimal.save();
        let message = ExpertAnimalMessages.success.s0;
        message.body = expertanimal;

        return res
            .header("location", "/expertsanimal/" + expertanimal._id)
            .status(message.http)
            .send(message);
    } catch (error) {
        console.error("Erro ao criar associação:", error);
        return res.status(500).send({
            message: "Erro ao criar associação de especialista com animal."
        });
    }
};

exports.update = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        const existingExpertAnimal = await ExpertAnimal.findOne({
            expert_id: req.body.expert_id,
            animal_id: req.body.animal_id,
            _id: { $ne: req.params.id } 
        });

        if (existingExpertAnimal) {
            return res.status(409).send({
                message: "Este especialista já está associado a este animal."
            });
        }

        ExpertAnimal.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        }, (error, expertanimal) => {
            if (error) throw error;
            if (!expertanimal) return res.status(ExpertAnimalMessages.error.e0.http).send(ExpertAnimalMessages.error.e0);

            let message = ExpertAnimalMessages.success.s1;
            message.body = expertanimal;
            return res.status(message.http).send(message);
        });
    } catch (error) {
        console.error("Erro ao atualizar associação:", error);
        return res.status(500).send({
            message: "Erro ao atualizar associação de especialista com animal."
        });
    }
};

exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    ExpertAnimal.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return res.status(ExpertAnimalMessages.error.e0.http).send(ExpertAnimalMessages.error.e0);
        return res.status(ExpertAnimalMessages.success.s3.http).send(ExpertAnimalMessages.success.s3);
    });
}

exports.getOne = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    ExpertAnimal.findOne({
        _id: req.params.id
    }).exec((error, expertanimal) => {
        if (error) throw error;
        if (!expertanimal) return res.status(ExpertAnimalMessages.error.e0.http).send(ExpertAnimalMessages.error.e0);

        let message = ExpertAnimalMessages.success.s2;
        message.body = expertanimal;
        return res.status(message.http).send(message);
    });
}

exports.getExpertNameByExpertId = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const expertId = req.params.id; 

    ExpertAnimal.findOne({ expert_id: expertId })
        .populate({
            path: 'expert_id', 
            select: 'name',  
        })
        .exec((error, expertAnimal) => {
            if (error) {
                return res.status(500).send({ message: 'Erro ao buscar especialista' });
            }

            if (!expertAnimal) {
                return res.status(404).send({ message: 'Especialista não encontrado para o ID fornecido.' });
            }

            res.status(200).send({
                expertName: expertAnimal.expert_id.name
            });
        });
};

exports.getAnimalNameByAnimalId = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const animalId = req.params.id; 

    ExpertAnimal.findOne({ animal_id: animalId })
        .populate({
            path: 'animal_id', 
            select: 'name',  
        })
        .exec((error, expertAnimal) => {
            if (error) {
                return res.status(500).send({ message: 'Erro ao buscar animal' });
            }

            if (!expertAnimal) {
                return res.status(404).send({ message: 'Animal não encontrado para o ID fornecido.' });
            }

            res.status(200).send({
                animalName: expertAnimal.animal_id.name
            });
        });
};

exports.getAnimalsByExpertId = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    const expertId = req.params.id; 

    ExpertAnimal.find({ expert_id: expertId })
        .populate({
            path: 'animal_id',
            select: 'name group',
        })
        .exec((error, expertAnimals) => {
            if (error) {
                return res.status(500).send({ message: 'Erro ao buscar animais e especialistas' });
            }

            if (!expertAnimals || expertAnimals.length === 0) {
                return res.status(404).send({ message: 'Nenhum animal e especialista encontrado para o ID fornecido.' });
            }

            const animals = expertAnimals.map(expertAnimal => ({
                animalName: expertAnimal.animal_id.name,
                species: expertAnimal.animal_id.group,
            }));

            res.status(200).send({
                expertId: expertId,
                animals: animals,
            });
        });
};