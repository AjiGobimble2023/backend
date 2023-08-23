const DiscussionTopic = require('./model');
const path = require('path');
const fs = require('fs');

const getAllDiscussionTopic = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 8;
    const searchQuery = req.query.search || '';
    const totalDiscusCount = await DiscussionTopic.countDocuments({
      title: { $regex: searchQuery, $options: 'i' },
    });

    const totalPages = Math.ceil(totalDiscusCount / limit);

    const discussionTopic = await DiscussionTopic.find({
      title: { $regex: searchQuery, $options: 'i' },
    })
    .populate('author', 'full_name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
    res.status(200).json({ data:discussionTopic, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching DiscussionTopic articles.' });
  }
};


const getDiscussionTopicById = async (req, res) => {
  const { id } = req.params;
  try {
    const discussionTopic = await DiscussionTopic.findById(id);
    if (!discussionTopic) {
      return res.status(404).json({ error: 'DiscussionTopic article not found.' });
    }
    res.status(200).json(discussionTopic);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching DiscussionTopic article.' });
  }
};

const createDiscussionTopic = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file;
    let imageName='';
    try {
      if (image) {
        const imageTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageExtension = path.extname(image.originalname);
        imageName = `${imageTitle}${imageExtension}`;
        const target = path.join(__dirname, '../../public/images/discus/', imageName);
        fs.renameSync(image.path, target);
      }
  
      const createdDiscussionTopic = await DiscussionTopic.create({
        title,
        content,
        author: req.user,
        image_url: image ? `http://192.168.20.249:3000/public/images/discus/${imageName}` : '',
      });
  
      res.status(201).json(createdDiscussionTopic);
    } catch (error) {
      console.error('Error creating DiscussionTopic article:', error);
  
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: 'Validation error', details: validationErrors });
      }
  
      res.status(500).json({ error: 'Error creating DiscussionTopic article.' });
    }
};

  

const updateDiscussionTopicById = async (req, res) => {
  const DiscussionTopicId = req.params.id;
  const { title, content} = req.body;
  const image = req.file;

  try {
    const discussionTopic = await DiscussionTopic.findById(DiscussionTopicId);

    if (!discussionTopic) {
      return res.status(404).json({ error: 'DiscussionTopic article not found.' });
    }

    DiscussionTopic.title = title;
    DiscussionTopic.content = content;
    DiscussionTopic.author = req.user;

    if (image) {
        const imageTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageExtension = path.extname(image.originalname);
        imageName = `${imageTitle}${imageExtension}`;
        const target = path.join(__dirname, '../../public/images/discus/', imageName);
        fs.renameSync(image.path, target);

       DiscussionTopic.image_url = image ? `http://192.168.20.249:3000/public/images/discus/${imageName}` : '';
      }


    await discussionTopic.save();

    res.status(200).json(discussionTopic);
  }  catch (error) {
    console.error('Error creating DiscussionTopic article:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }

    res.status(500).json({ error: 'Error creating DiscussionTopic article.' });
  }
};

const deleteDiscussionTopicById = async (req, res) => {
  const DiscussionTopicId = req.params.id;

  try {
    const deletedDiscussionTopic = await DiscussionTopic.findByIdAndDelete(DiscussionTopicId);

    if (!deletedDiscussionTopic) {
      return res.status(404).json({ error: 'DiscussionTopic article not found.' });
    }

    res.status(200).json({ message: 'DiscussionTopic article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting DiscussionTopic article.' });
  }
};

module.exports = {
  getAllDiscussionTopic,
  getDiscussionTopicById,
  createDiscussionTopic,
  updateDiscussionTopicById,
  deleteDiscussionTopicById,
};
