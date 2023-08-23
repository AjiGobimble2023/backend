const router = require('express').Router();
const discussionTopicController = require('./controller');
const multer = require('multer');
const { police_check } = require('../../middleware');
const os = require('os');


router.get('/discussionTopic', discussionTopicController.getAllDiscussionTopic);
router.get('/discussionTopic/:id', discussionTopicController.getDiscussionTopicById);
router.post('/discussionTopic',  multer({dest:os.tmpdir()}).single('image'),police_check('create','discussionTopic'), discussionTopicController.createDiscussionTopic);
router.put('/discussionTopic/:id',  multer({dest:os.tmpdir()}).single('image'),police_check('Update','discussionTopic'), discussionTopicController.updateDiscussionTopicById);
router.delete('/discussionTopic/:id', police_check('discussionTopic','Delete'),discussionTopicController.deleteDiscussionTopicById);

module.exports = router;
