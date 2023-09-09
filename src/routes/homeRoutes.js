const { Router } = require('express');
const controller = require('./../controllers/homeController');
const router = Router();

router.get('', controller.getBudgets);
router.post('/createBudget', controller.createBudget);
router.delete('/deleteBudget', controller.deleteBudget);

module.exports = router;