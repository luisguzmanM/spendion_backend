const { Router } = require('express');
const controller = require('./../controllers/settingController');
const router = Router();

router.post('/updateDataUser', controller.updateDataUser);

module.exports = router;