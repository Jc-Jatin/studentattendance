// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/student-attendance-system', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const Student = require('./models/Student');
const Attendance = require('./models/Attendance');

// Dummy students
const students = [
  { name: 'Jai', rollNumber: '101' },
  { name: 'Vijay', rollNumber: '102' },
  { name: 'Ram', rollNumber: '103' },
  { name: 'Dev', rollNumber: '104' },
  { name: 'Deepak', rollNumber: '105' },
  { name: 'Deepanker', rollNumber: '106' },
  { name: 'Waseem', rollNumber: '107' },
  { name: 'Sunny', rollNumber: '108' },
  { name: 'Arun', rollNumber: '109' },
  { name: 'Sachin', rollNumber: '110' },
];

// Create dummy students if not exists
Student.insertMany(students, { ordered: false, rawResult: true })
  .then(result => console.log(`Inserted ${result.insertedCount} students`))
  .catch(error => console.error(`Error inserting students: ${error.message}`));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/attendance', async (req, res) => {
  const studentsList = await Student.find();
  res.render('attendance', { students: studentsList });
});

app.post('/markAttendance', async (req, res) => {
  const date = req.body.date;
  const presentStudents = req.body.present || [];

  const attendanceData = {
    date: moment(date).format('YYYY-MM-DD'),
    students: presentStudents.map(studentId => ({ student: studentId, present: true })),
  };

  await Attendance.create(attendanceData);
  res.redirect('/attendance');
});

app.get('/showAttendance', async (req, res) => {
  const attendanceData = await Attendance.find().populate('students.student');
  res.render('showAttendance', { attendance: attendanceData });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
