const News = require('./model');
const path = require('path');
const fs = require('fs');

const getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 5;
    const searchQuery = req.query.search || '';

    const totalNewsCount = await News.countDocuments({
      title: { $regex: searchQuery, $options: 'i' },
    });

    const totalPages = Math.ceil(totalNewsCount / limit);

    const news = await News.find({
      title: { $regex: searchQuery, $options: 'i' },
    })
      .populate('author', 'full_name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ data:news, totalPages }); // Send the total number of pages
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news articles.' });
  }
};



const getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found.' });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news article.' });
  }
};

const createNews = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file;
    let imageName='';
    try {
      if (image) {
        const imageTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageExtension = path.extname(image.originalname);
        imageName = `${imageTitle}${imageExtension}`;
        const target = path.join(__dirname, '../../public/images/news/', imageName);
        fs.renameSync(image.path, target);
      }
  
      const createdNews = await News.create({
        title,
        content,
        author: req.user,
        image_url: image ? `http://192.168.7.210:3001/public/images/news/${imageName}` : '',
      });
  
      res.status(201).json(createdNews);
    } catch (error) {
      console.error('Error creating news article:', error);
  
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ error: 'Validation error', details: validationErrors });
      }
  
      res.status(500).json({ error: 'Error creating news article.' });
    }
};

  

const updateNewsById = async (req, res) => {
  const newsId = req.params.id;
  const { title, content} = req.body;
  const image = req.file;

  try {
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ error: 'News article not found.' });
    }

    news.title = title;
    news.content = content;
    news.author = req.user;

    if (image) {
        const imageTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageExtension = path.extname(image.originalname);
        imageName = `${imageTitle}${imageExtension}`;
        const target = path.join(__dirname, '../../public/images/news/', imageName);
        fs.renameSync(image.path, target);

       news.image_url = image ? `http://192.168.7.210:3001/public/images/news/${imageName}` : '';
      }


    await news.save();

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Error updating news article.' });
  }
};

const deleteNewsById = async (req, res) => {
  const newsId = req.params.id;

  try {
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      return res.status(404).json({ error: 'News article not found.' });
    }

    res.status(200).json({ message: 'News article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting news article.' });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNewsById,
  deleteNewsById,
};
