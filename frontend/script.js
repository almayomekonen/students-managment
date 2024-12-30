const apiBase = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
  loadStudents();
  loadTasks();

  const loggedIn = localStorage.getItem("loggedIn");

  if (loggedIn) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("students-section").style.display = "block";
    document.getElementById("tasks-section").style.display = "block";

    loadStudents();
    loadTasks();
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("students-section").style.display = "none";
    document.getElementById("tasks-section").style.display = "none";
  }

  document
    .getElementById("login-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("teacher-name").value;
      const id = document.getElementById("teacher-id").value;

      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id }),
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        localStorage.setItem("loggedIn", "true");

        document.getElementById("login-section").style.display = "none";
        document.getElementById("students-section").style.display = "block";
        document.getElementById("tasks-section").style.display = "block";

        loadStudents();
        loadTasks();
      } else {
        document.getElementById("login-error").style.display = "block";
      }
    });

  document
    .getElementById("add-student-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("student-name").value;
      const studentClass = document.getElementById("student-class").value;
      const phone = document.getElementById("student-phone").value;

      await fetch(`${apiBase}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now(),
          name,
          class: studentClass,
          phone,
        }),
      });
    });

  document
    .getElementById("add-task-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const title = document.getElementById("task-title").value;
      const description = document.getElementById("task-description").value;
      const studentId = document.getElementById("task-student").value;

      await fetch(`${apiBase}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Date.now(), title, description, studentId }),
      });
    });
});

async function loadStudents() {
  const response = await fetch(`${apiBase}/students`);
  const students = await response.json();

  const list = document.getElementById("students-list");
  list.innerHTML = "";
  const select = document.getElementById("task-student");

  students.forEach((student) => {
    const li = document.createElement("li");
    li.textContent = `${student.name} - ${student.class} - ${student.phone}`;
    list.appendChild(li);

    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = student.name;
    select.appendChild(option);
  });
}

async function loadTasks() {
  const [studentsRes, tasksRes] = await Promise.all([
    fetch(`${apiBase}/students`),
    fetch(`${apiBase}/tasks`),
  ]);
  const students = await studentsRes.json();
  const tasks = await tasksRes.json();

  const list = document.getElementById("tasks-list");
  list.innerHTML = "";

  students.forEach((student) => {
    const studentLi = document.createElement("li");
    studentLi.innerHTML = `<strong>${student.name} (${student.class}):</strong>`;

    const taskList = document.createElement("ul");

    tasks
      .filter((task) => task.studentId == student.id)
      .forEach((task) => {
        const taskLi = document.createElement("li");
        taskLi.textContent = `${task.title} - ${task.description}`;
        taskList.appendChild(taskLi);
      });

    if (taskList.children.length > 0) {
      studentLi.appendChild(taskList);
    } else {
      studentLi.innerHTML += " No tasks assigned.";
    }

    list.appendChild(studentLi);
  });
}
