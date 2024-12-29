const apiBase = "http://localhost:8080/api";

document.addEventListener("DOMContentLoaded", () => {
  loadStudents();

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
  const select = document.getElementById("task-student");

  students.forEach((student) => {
    const li = document.createElement("li");
    li.textContent = `${student.name} - ${student.class} - ${student.phone}`;
    list.appendChild(li);
  });
}
