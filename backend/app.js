const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const server = express();

// cros origin resource share
server.use(cors());
server.use(express.json());

const studentsFile = path.join(__dirname, "data", "students.json");
const tasksFile = path.join(__dirname, "data", "tasks.json");

// list of students
server.get("/api/students", (req, res) => {
  const studnets = JSON.parse(fs.readFileSync(studentsFile));
  res.json(studnets);
});

server.post("/api/students", (req, res) => {
  const students = JSON.parse(fs.readFileSync(studentsFile));
  const newStudent = req.body;
  console.log(req.body);

  students.push(newStudent);
  fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
  res.json(newStudent);
});

// tasks
server.get("/api/tasks", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFile));
  res.json(tasks);
});

server.post("/api/tasks", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFile));
  const newTask = req.body;

  tasks.push(newTask);
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  res.json(newTask);
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});