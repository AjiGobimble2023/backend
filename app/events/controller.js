const Events = require('./model');
const path = require('path');
const fs = require('fs');

const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 5;
    const searchQuery = req.query.search || '';

    const totalevents = await Events.countDocuments({
      title: { $regex: searchQuery, $options: 'i' },
    });
    const totalPages = Math.ceil(totalevents / limit);
    
    const event = await Events.find({
      title: { $regex: searchQuery, $options: 'i' },
    })
      .populate('createdBy', 'full_name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ data:event, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Events articles.' });
  }
};

const getEventsById = async (req, res) => {
  const { id } = req.params;
  try {
    const events = await Events.findById(id);
    if (!events) {
      return res.status(404).json({ error: 'Events article not found.' });
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Events article.' });
  }
};

const createEvents = async (req, res) => {
  const { title, date, location, description } = req.body;
  const image = req.file;
  let imageName = '';

  try {
    if (image) {
      const imageTitle = title.replace(/\s+/g, '-').toLowerCase();
      const imageExtension = path.extname(image.originalname);
      imageName = `${imageTitle}${imageExtension}`;
      const target = path.join(__dirname, '../../public/images/events/', imageName);
      fs.renameSync(image.path, target);
    }

    const createdEvent = await Events.create({
      title,
      date,
      location,
      description,
      createdBy: req.user,
      image_url: image ? `http://192.168.20.249:3000/public/images/events/${imageName}` : '',
    });

    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Error creating event:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }

    res.status(500).json({ error: 'Error creating event.' });
  }
};

  

const updateEventsById = async (req, res) => {
  const EventsId = req.params.id;
  const { title, date, location, description} = req.body;
  const image = req.file;

  try {
    const events = await Events.findById(EventsId);

    if (!events) {
      return res.status(404).json({ error: 'Events article not found.' });
    }

    events.title = title;
    events.description = description;
    events.updatedBy = req.user;
    events.date = date;
    events.location = location;

    if (image) {
        const imageTitle = title.replace(/\s+/g, '-').toLowerCase();
        const imageExtension = path.extname(image.originalname);
        imageName = `${imageTitle}${imageExtension}`;
        const target = path.join(__dirname, '../../public/images/Events/', imageName);
        fs.renameSync(image.path, target);

       events.image_url = image ? `http://192.168.20.249:3000/public/images/Events/${imageName}` : '';
      }


    await events.save();

    res.status(200).json(events);
  }  catch (error) {
    console.error('Error creating event:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }

    res.status(500).json({ error: 'Error creating event.' });
  }
};

const deleteEventsById = async (req, res) => {
  const EventsId = req.params.id;

  try {
    const deletedEvents = await Events.findByIdAndDelete(EventsId);

    if (!deletedEvents) {
      return res.status(404).json({ error: 'Events article not found.' });
    }

    res.status(200).json({ message: 'Events article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting Events article.' });
  }
};

module.exports = {
  getAllEvents,
  getEventsById,
  createEvents,
  updateEventsById,
  deleteEventsById,
};
