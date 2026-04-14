async function sendToAll() {
  const title = document.getElementById("title").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!title || !message) {
    alert("Enter title and message");
    return;
  }

  const combined = `${title}||${message}`; // 🔥 IMPORTANT

  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/notifications/send-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ message: combined })
  });

  alert("Notification sent ✅");

  // clear inputs
  document.getElementById("title").value = "";
  document.getElementById("message").value = "";

  loadNotifications(); // refresh
}
async function deleteNotification(id) {
  const confirmDelete = confirm("Delete this notification?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/notifications/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert("Deleted ✅");
  loadNotifications();
}
async function loadNotifications() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/notifications/all", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  const container = document.getElementById("notificationList");
  container.innerHTML = "";

  data.forEach(n => {

    let title = "";
    let message = n.message;

    // 🔥 SPLIT LOGIC
    if (n.message.includes("||")) {
      const parts = n.message.split("||");
      title = parts[0];
      message = parts[1];
    }
let formattedDate = "No date";

if (n.date_sent && n.date_sent !== "0000-00-00 00:00:00") {
  formattedDate = new Date(n.date_sent).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
 
} else {
  formattedDate = "Recently";
}
    const card = `
      <div class="notification-card">
      <div class="notification-card-left">
      ◉
      </div>
      <div class="notification-card-right">
      <div class="card-left-top">
      <div class="notif-title">${title}</div>
      <div class="notif-message">${message}</div>
      
      </div>
      <div class="card-left-bottom">
      <div class="notif-date">
        ${formattedDate}
      </div>
      </div>
      </div>
      <button onclick="deleteNotification(${n.notification_id})" class="del tableBtn my-auto">
  <i class="fa-solid fa-trash"></i>
</button>
      </div>
    `;

    container.innerHTML += card;
  });
}
window.addEventListener("DOMContentLoaded", loadNotifications);
