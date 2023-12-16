const { Router } = require('express');
const router = Router();
const controller = require('./../controllers/paymentsControllers');

// Testing simple payments
router.post('/createPayment', controller.createPayment);
router.get('/executePayment', controller.executePayment);

// Services
router.post('/createProduct', controller.createProduct);
router.post('/createPlan'   , controller.createPlan);
router.post('/createSubscription'   , controller.createSubscription);

// Hooks
router.post('/webHookCreateProduct', controller.webHookCreateProduct);

module.exports = router;