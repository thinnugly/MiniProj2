const express = require('express');
let router = express.Router();
const ExpertAnimalController = require('../controllers/expertanimal.controller');
const {
    body,
    param,
    sanitizeBody
} = require('express-validator');
const CONFIG = require("../config/config");
const AuthController = require("../controllers/auth.controller");

router.route('/')
    .get(AuthController.checkAuth, ExpertAnimalController.get)
    .post(AuthController.checkAuth, [
        body('expert_id').isString(),
        body('animal_id').isString(),
        body('association_type').isString(),
        body('notes').optional().isString(),
        sanitizeBody('notes').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical)
    ], ExpertAnimalController.create);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], ExpertAnimalController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId()], ExpertAnimalController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], ExpertAnimalController.delete);

router.route('/getexpertbyid/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], ExpertAnimalController.getExpertNameByExpertId);

router.route('/getanimalbyid/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], ExpertAnimalController.getAnimalNameByAnimalId);

router.route('/getanimalsbyexpert/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], ExpertAnimalController.getAnimalsByExpertId);

module.exports = router;
