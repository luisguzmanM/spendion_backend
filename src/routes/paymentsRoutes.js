const { Router } = require('express');
const router = Router();
const controller = require('./../controllers/paymentsControllers');

// Testing payments
router.post('/createPayment', controller.createPayment);
router.get('/executePayment', controller.executePayment);

// Subscription
router.post('/createProduct', controller.createProduct);
router.post('/createPlan'   , controller.createPlan);
router.post('/createSubscription'   , controller.createSubscription);

module.exports = router;