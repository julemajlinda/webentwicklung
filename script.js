document.addEventListener("DOMContentLoaded", () => {

  function generateCurrentWeekCalendar() {
    const calendarDays = document.querySelectorAll(".calendar-grid .day");
    const today = new Date();
  
    const currentDay = today.getDay();
    const offsetToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + offsetToMonday);
  
    calendarDays.forEach((dayEl, index) => {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + index);
  
      const formattedDate = currentDate.toLocaleDateString("de-DE");
  
      const dateSpan = dayEl.querySelector(".date");
      if (dateSpan) {
        dateSpan.textContent = formattedDate;
      }
  
      const taskSpan = dayEl.querySelector(".task");
      if (taskSpan && taskSpan.textContent.trim() === "") {
        taskSpan.textContent = "–";
      }
  
      if (currentDate.toDateString() === today.toDateString()) {
        dayEl.style.backgroundColor = "#fffae6";
        dayEl.style.border = "1px solid #ffce00";
      }
    });
  }
  

    const form = document.querySelector(".task-entry form");
    const subjectInput = form.querySelector("input[placeholder='Fach (z.B. Mathe)']");
    const taskInput = form.querySelector("input[placeholder='Aufgabe (z.B. Seite 12, Nr. 3-6)']");
    const dateInput = form.querySelector("input[type='date']");
    const openTasksList = document.querySelector(".task-lists .task-column ul");
    const calendarDays = document.querySelectorAll(".calendar-grid .day");
    const profileButton = document.querySelector(".profile-menu a:first-child");
    const settingsButton = document.querySelector(".profile-menu a:last-child");
  
    // === Hausaufgabe hinzufügen ===
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const subject = subjectInput.value.trim();
      const task = taskInput.value.trim();
      const dueDate = dateInput.value;
  
      if (subject && task && dueDate) {
        const newTask = document.createElement("li");
        newTask.innerHTML = `
          <label>
            <input type="checkbox" class="task-checkbox">
            <strong>${subject}:</strong> ${task} – <em>Abgabe: ${dueDate}</em>
          </label>
        `;
        openTasksList.appendChild(newTask);
        form.reset();
        alert("Neue Hausaufgabe wurde hinzugefügt!");
        addTaskToCalendar(subject, task, dueDate);
      } else {
        alert("❗ Bitte alle Felder ausfüllen.");
      }
    });
  
    // === Erledigt verschieben mit Checkbox ===
    document.addEventListener("change", (event) => {

      // Prüfen, ob das geänderte Element eine Checkbox ist
      if (event.target.classList.contains("task-checkbox")) {
        const clickedTask = event.target.closest("li");
  
        const doneList = document.querySelectorAll(".task-column ul")[1];
        const openList = document.querySelectorAll(".task-column ul")[0];
        
        if (event.target.checked) {
          // Verschiebe in erledigte Aufgaben
          doneList.appendChild(clickedTask);
          clickedTask.classList.add("done");
          alert("Aufgabe als erledigt markiert!");
        } else {
          // Verschiebe zurück zu offenen Aufgaben
          openList.appendChild(clickedTask);
          clickedTask.classList.remove("done");
          alert("Aufgabe zurück in offene Aufgaben verschoben!");
        }
        
      }
    });
  
    // === Neue Aufgabe zum Kalender hinzufügen ===
    function addTaskToCalendar(subject, task, dueDate) {
      const formattedDueDate = new Date(dueDate).toLocaleDateString("de-DE");
      let taskAdded = false;
      calendarDays.forEach(day => {
        const dayDate = day.querySelector(".date").textContent.trim();
        if (dayDate === formattedDueDate) {
          const taskParagraph = day.querySelector(".task");
          if (taskParagraph.textContent === "–") {
            taskParagraph.textContent = `${subject} abgeben`;
          } else {
            taskParagraph.textContent += `, ${subject} abgeben`;
          }
          taskAdded = true;
        }
      });
      if (!taskAdded) {
        console.log(`Hinweis: Abgabedatum (${formattedDueDate}) liegt nicht in dieser Woche.`);
      }
    }
  
    // === Profil Button ===
    profileButton.addEventListener("click", (event) => {
      event.preventDefault();
      alert("👤 Profil: Jule\nFeature bald verfügbar!");
    });
  
    // === Einstellungen Dropdown erstellen ===
    const settingsMenu = document.createElement("div");
    settingsMenu.style.position = "absolute";
    settingsMenu.style.top = "60px";
    settingsMenu.style.right = "20px";
    settingsMenu.style.background = "#fff";
    settingsMenu.style.border = "1px solid #ccc";
    settingsMenu.style.padding = "10px";
    settingsMenu.style.borderRadius = "8px";
    settingsMenu.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    settingsMenu.style.display = "none";
    settingsMenu.style.zIndex = "1000";
  
    settingsMenu.innerHTML = `
      <button id="themeToggle">🎨 Theme wechseln</button><br><br>
      <button id="changeName">✏️ Namen ändern</button><br><br>
      <button id="clearTasks">Alle bestehenden Aufgaben löschen</button>
    `;
  
    document.body.appendChild(settingsMenu);
  
    settingsButton.addEventListener("click", (event) => {
      event.preventDefault();
      settingsMenu.style.display = settingsMenu.style.display === "none" ? "block" : "none";
    });
  
    // === Menü: Theme ändern ===
    document.getElementById("themeToggle").addEventListener("click", () => {
      document.body.style.backgroundColor =
        document.body.