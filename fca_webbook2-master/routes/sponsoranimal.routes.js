const express = require('express');
let router = express.Router();
const SponsorAnimalController = require('../controllers/sponsoranimal.controller');
const {
    body,
    param,
    sanitizeBody
} = require('express-validator');
const CONFIG = require("../config/config");
const AuthController = require("../controllers/auth.controller");

router.route('/')
    .get(AuthController.checkAuth, SponsorAnimalController.get)
    .post(AuthController.checkAuth, [
        body('sponsor_id').isString(),
        body('animal_id').isString(),
        body('notes').optional().isString(),
        sanitizeBody('notes').whitelist(CONFIG.sanitize.alphabet + CONFIG.sanitize.numerical)
    ], SponsorAnimalController.create);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], SponsorAnimalController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorAnimalController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], SponsorAnimalController.delete);

router.route('/getsponsorbyid/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], SponsorAnimalController.getSponsorNameBySponsorId);

router.route('/getanimalbyid/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], SponsorAnimalController.getAnimalNameByAnimalId);

router.route('/getanimalsbyponsord/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], SponsorAnimalController.getAnimalsBySponsorId);

module.exports = router;
