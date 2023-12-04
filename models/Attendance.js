const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: Date,
  students: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    present: Boolean,
  }],
});

module.exports = mongoose.model('Attendance', attendanceSchema);
