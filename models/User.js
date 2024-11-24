const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String,  },
  password: String,
  role: { type: String, enum: ['customer', 'agent', 'admin'], default: 'customer' },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
