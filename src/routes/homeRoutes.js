const { Router } = require('express');
const controller = require('./../controllers/homeController');
const router = Router();

router.get('', controller.getBudgets);

module.exports = router;