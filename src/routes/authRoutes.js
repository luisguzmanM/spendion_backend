const { Router } = require('express');
const controller = require('./../controllers/authControllers');
const router = Router();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.put('/confirmation', controller.confirmation);

module.exports = router;