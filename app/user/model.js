const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Field Name Harus Ada'],
    minlength: [3, 'nama Minimal 3 karakter'],
    maxlength:[255, 'panjang nama maksimal 255 karakter']
  },
  email: {
    type: String,
    maxlength:[255, 'Panjang email maksimal 255'],
    required:[true, 'email Harus diisi']
  },
  password: {
    type: String,
    maxlength:[255, 'Panjang password maksimal 255'],
    required:[true, 'password Harus diisi']
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
 },
  token: [String],
  birthDate: {
    type: Date,
    required:[true, 'Tanggal Lahir Harus diisi']
  },
  address: {
    type: String,
    required:[true, 'Alamat Harus diisi']
  },
  phoneNumber: {
    type: String,
    required:[true, 'No Handphone Harus diisi']
  },
  campus_name: {
    type: String,
    required:[true, 'Nama Kampus Harus diisi']
  },
  city: {
    type: String,
    required:[true, 'Nama Kota Harus diisi']
  },
  image_url: {
    type: String,
    default: null
  },

},{timestamps:true});


userSchema.path('email').validate(function(value){
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_RE.test(value)
}, attr => `${attr.value} harus merupakan email valid!`);


const User = mongoose.model('User', userSchema);

module.exports = User;