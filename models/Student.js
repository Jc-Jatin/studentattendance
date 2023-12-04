const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
});

module.exports = mongoose.model('Student', studentSchema);
