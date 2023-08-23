const router = require('express').Router();
const EventsController = require('./controller');
const multer = require('multer');
const { police_check } = require('../../middleware');
const os = require('os');


router.get('/events', EventsController.getAllEvents);
router.get('/events/:id', EventsController.getEventsById);
router.post('/events',  multer({dest:os.tmpdir()}).single('image'),police_check('create','Events'), EventsController.createEvents);
router.put('/events/:id',  multer({dest:os.tmpdir()}).single('image'),police_check('Update','Events'), EventsController.updateEventsById);
router.delete('/events/:id', police_check('Events','Delete'),EventsController.deleteEventsById);

module.exports = router;
