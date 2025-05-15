document.addEventListener("DOMContentLoaded", () => {

  const calendarDays = document.querySelectorAll(".calendar-grid .day");
  const form = document.querySelector(".task-entry form");
  const [subjectInput, taskInput, dateInput] = form.querySelectorAll("input");
  const [openTasksList, doneTasksList] = document.querySelectorAll(".task-column ul");
  const profileButton = document.querySelector(".profile-menu a:first-child");
  const settingsButton = document.querySelector(".profile-menu a:last-child");
  const welcomeMsg = document.querySelector(".welcome-msg");

  function generateCurrentWeekCalendar() {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    calendarDays.forEach((dayEl, i) => {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      const formattedDate = currentDate.toLocaleDateString("de-DE");

      dayEl.querySelector(".date").textContent = formattedDate;
      const taskEl = dayEl.querySelector(".task");
      if (taskEl && !taskEl.textContent.trim()) taskEl.textContent = "–";

      if (currentDate.toDateString() === today.toDateString()) {
        Object.assign(dayEl.style, {
          backgroundColor: "#fffae6",
          border: "1px solid #ffce00"
        });
      }
    });
  }

  function addTaskToCalendar(subject, task, dueDate) {
    const formattedDue = new Date(dueDate).toLocaleDateString("de-DE");
    let found = false;

    calendarDays.forEach(day => {
      if (day.querySelector(".date").textContent.trim() === formattedDue) {
        const taskEl = day.querySelector(".task");
        if (taskEl.textContent === "–") {
          taskEl.textContent = subject + " abgeben";
        } else {
          taskEl.textContent += ", " + subject + " abgeben";
        }
        found = true;
      }
    });

    if (!found) console.log("Hinweis: Abgabedatum (" + formattedDue + ") liegt nicht in dieser Woche.");
  }
// neue aufgabe
  form.addEventListener("submit", e => {
    e.preventDefault();
    const subject = subjectInput.value.trim();
    const task = taskInput.value.trim();
    const dueDate = dateInput.value;

    if (subject && task && dueDate) {
      const li = document.createElement("li");
      li.innerHTML = `<label>
        <input type='checkbox' class='task-checkbox'>
        <strong>${subject}:</strong> ${task} – <em>Abgabe: ${dueDate}</em>
      </label>`;
      openTasksList.appendChild(li);
      addTaskToCalendar(subject, task, dueDate);
      saveTasksToStorage();
      form.reset();
      alert("Neue Hausaufgabe wurde hinzugefügt!");
    } else {
      alert("❗ Bitte alle Felder ausfüllen.");
    }
  });

  document.addEventListener("change", e => {
    if (e.target.classList.contains("task-checkbox")) {
      const li = e.target.closest("li");
      const targetList = e.target.checked ? doneTasksList : openTasksList;
      li.classList.toggle("done", e.target.checked);
      targetList.appendChild(li);
      saveTasksToStorage();

      alert(e.target.checked ? "Aufgabe als erledigt markiert!" : "Aufgabe zurück in offene Aufgaben verschoben!");
    }
  });

  profileButton.addEventListener("click", e => {
    e.preventDefault();
    alert("👤 Profil: Jule\nFeature bald verfügbar!");
  });

  // einstellungen
  const settingsMenu = document.createElement("div");
  Object.assign(settingsMenu.style, {
    position: "absolute", top: "60px", right: "20px", background: "#fff",
    border: "1px solid #ccc", padding: "10px", borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)", display: "none", zIndex: 1000
  });
  settingsMenu.innerHTML = 
    "<button id='themeToggle'>🎨 Theme wechseln</button><br><br>" +
    "<button id='changeName'>✏️ Namen ändern</button><br><br>" +
    "<button id='clearTasks'>Alle bestehenden Aufgaben löschen</button>";
  document.body.appendChild(settingsMenu);

  settingsButton.addEventListener("click", e => {
    e.preventDefault();
    settingsMenu.style.display = settingsMenu.style.display === "none" ? "block" : "none";
  });
  
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.style.backgroundColor =
      document.body.style.backgroundColor === "rgb(229, 175, 241)" ? "#a6ddf0" : "#e5aff1";
    settingsMenu.style.display = "none";
  });

  document.getElementById("changeName").addEventListener("click", () => {
    const newName = prompt("Wie möchtest du begrüßt werden?");
    if (newName) {
      welcomeMsg.textContent = `Willkommen zurück, ${newName}! Bereit für produktives Lernen?✏️`;
      localStorage.setItem("userName", newName);
    }
    settingsMenu.style.display = "none";
  });

  document.getElementById("clearTasks").addEventListener("click", () => {
    if (confirm("Alle Aufgaben wirklich löschen?")) {
      [openTasksList, doneTasksList].forEach(ul => ul.innerHTML = "");
      saveTasksToStorage();
    }
    settingsMenu.style.display = "none";
  });

  document.addEventListener("click", e => {
    if (!settingsMenu.contains(e.target) && !settingsButton.contains(e.target)) {
      settingsMenu.style.display = "none";
    }
  });

  function saveTasksToStorage() {
    const openTasks = Array.from(openTasksList.querySelectorAll("li")).map(li => li.innerHTML);
    const doneTasks = Array.from(doneTasksList.querySelectorAll("li")).map(li => {
      li.querySelector("input").checked = true; 
      return li.innerHTML;
    });

    localStorage.setItem("openTasks", JSON.stringify(openTasks));
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
  }

  function loadTasksFromStorage() {
    const openTasks = JSON.parse(localStorage.getItem("openTasks") || "[]");
    const doneTasks = JSON.parse(localStorage.getItem("doneTasks") || "[]");

    openTasks.forEach(taskHTML => {
      const li = document.createElement("li");
      li.innerHTML = taskHTML;
      openTasksList.appendChild(li);
    });

    doneTasks.forEach(taskHTML => {
      const li = document.createElement("li");
      li.innerHTML = taskHTML;
      li.classList.add("done");
      li.querySelector("input").checked = true;
      doneTasksList.appendChild(li);
    });
  }

  const savedName = localStorage.getItem("userName");
  if (savedName) {
    welcomeMsg.textContent = `Willkommen zurück, ${savedName}! Bereit für produktives Lernen?✏️`;
  }

  generateCurrentWeekCalendar();
  loadTasksFromStorage();
});
