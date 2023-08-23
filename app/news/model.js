const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Field Title Harus Ada'],
    minlength: [3, 'Judul Minimal 3 karakter'],
    maxlength: [255, 'Panjang judul maksimal 255 karakter']
  },
  content: {
    type: String,
    required: [true, 'Field Content Harus Ada'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image_url:{ 
    type: String}, 
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

module.exports = News;
