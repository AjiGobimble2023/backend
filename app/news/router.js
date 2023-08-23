const router = require('express').Router();
const newsController = require('./controller');
const multer = require('multer');
const { police_check } = require('../../middleware');
const os = require('os');


router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);
router.post('/news',  multer({dest:os.tmpdir()}).single('image'),police_check('create','News'), newsController.createNews);
router.put('/news/:id',  multer({dest:os.tmpdir()}).single('image'),police_check('Update','News'), newsController.updateNewsById);
router.delete('/news/:id', police_check('News','Delete'),newsController.deleteNewsById);

module.exports = router;
