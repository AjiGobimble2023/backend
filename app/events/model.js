const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Field Title Harus Ada'],
    minlength: [3, 'Judul Minimal 3 karakter'],
    maxlength: [255, 'Panjang judul maksimal 255 karakter']
  },
  date: {
    type: Date,
    required: [true, 'Tanggal Harus diisi'],
  },
  location: {
    type: String},
  description:  {
    type: String},
  image_url:{
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
