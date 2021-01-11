let express = require('express'),
    router = express.Router(),
    AccountController = require('./controllers/account');

router.post('/reset', AccountController.reset);
router.post('/event', AccountController.handle_event);
router.get('/balance', AccountController.balance);

module.exports = router;
