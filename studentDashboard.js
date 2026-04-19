// ==============================
// 🔐 AUTH CHECK (STUDENT)
// ==============================
const token = localStorage.getItem("token");

// ❌ If no token → redirect to login
if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}

// ==============================
// 📊 LOAD STUDENT RESULTS
// ==============================
async function loadMyResults() {
  const token = localStorage.getItem("token");

  // 🔄 Fetch only logged-in student's results
  const res = await fetch("http://localhost:5000/api/results/my-results", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  

  const table = document.getElementById("studentResultTable");
  table.innerHTML = "";
   
   // ⏳ If no results yet
  if (data.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center">
          ⏳ Result not declared yet
        </td>
      </tr>
    `;
    return;
  }

  // 🔁 Loop through results
  data.forEach(r => {

     // 🎨 Grade styling
    let gradeClass = "";
      let gradeBack ="";
      
      if (r.grade === "A") {
        gradeClass = "grade-a";
        gradeBack = "grade-green";
      } else if (r.grade === "B") {
        gradeClass = "grade-b";
        gradeBack = "grade-blue";
      } else if (r.grade === "C") {
        gradeClass = "grade-c";
        gradeBack = "grade-white";
      }
      else if(r.grade === "F"){
        gradeClass ="grade-f"
        gradeBack ="grade-red"
      }

      // 📄 Render table row
    const row = `
      <tr>
        <td class="resultSub">${r.subject}</td>
        <td class="resultMarks ${gradeClass}">${r.marks}</td>
        <td class="resultGrade ${gradeClass}"><span class="${gradeBack}">${r.grade}</span></td>
        <td class="resultSem">${r.semester}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// ==============================
// 🔔 LOAD STUDENT NOTIFICATIONS
// ==============================
async function loadStudentNotifications() {
  const token = localStorage.getItem("token");

   // 🔄 Fetch all notifications
  const res = await fetch("http://localhost:5000/api/notifications/all", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  const container = document.getElementById("studentNotifications");
  container.innerHTML = "";

  // 🔁 Loop notifications
  data.forEach(n => {

    let title = "";
    let message = n.message;

    // 🔥 Split title & message (stored as "title||message")
    if (n.message.includes("||")) {
      const parts = n.message.split("||");
      title = parts[0];
      message = parts[1];
    }

    // 📅 Format date
    const date = new Date(n.date_sent).toLocaleDateString("en-IN");

     // 🧾 Notification card UI
    const card = `
      <div class="card p-2 mb-2">
       <div class="notification-card-left">
      ◉
      </div>
      <div class="notification-card-right">
        <div class="d-flex w-100 justify-content-between">
          <div class="notif-title">${title}</div>
          <div class="notif-date">${date}</div>
        </div>
        <div class="notif-message">${message}</div>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });
 
}
// ==============================
// 🚀 INITIAL LOAD (STUDENT DASHBOARD)
// ==============================
window.addEventListener("DOMContentLoaded", () => {
  loadMyResults();// load student results
  loadStudentNotifications();// load notifications
});