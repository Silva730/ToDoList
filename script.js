 const API_URL = "/tasks";

    const taskForm = document.querySelector(".task-form");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");


    async function loadTasks() {
      try {
        const res = await fetch(API_URL);
        const tasks = await res.json();
        taskList.innerHTML = "";
        tasks.forEach(task => {
          const li = document.createElement("li");
          li.className = task.done ? "done" : "";
          li.innerHTML = `
            <span>${task.title}</span>
            <div class="actions">
              <button class="done-btn">✔</button>
              <button class="delete-btn">✖</button>
            </div>
          `;
         
          li.querySelector(".done-btn").addEventListener("click", async () => {
            await fetch(`${API_URL}/${task.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ done: task.done ? 0 : 1 })
            });
            loadTasks();
          });
          // Deletar
          li.querySelector(".delete-btn").addEventListener("click", async () => {
            await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
            loadTasks();
          });
          taskList.appendChild(li);
        });
      } catch (err) {
        console.error("Erro ao carregar tarefas:", err);
      }
    }

   
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = taskInput.value.trim();
      if (title) {
        try {
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, done: 0 })
          });
          taskInput.value = "";
          loadTasks();
        } catch (err) {
          console.error("Erro ao adicionar tarefa:", err);
        }
      }
    });
