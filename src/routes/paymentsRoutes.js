const { Router } = require('express');
const router = Router();
const controller = require('./../controllers/paymentsControllers');

// Services
router.post('/createProduct', controller.createProduct);
router.post('/createPlan'   , controller.createPlan);
router.post('/createSubscription'   , controller.createSubscription);

// Hooks
router.post('/webHookCreateProduct', controller.webHookCreateProduct);

module.exports = router;