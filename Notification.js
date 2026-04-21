// =======================================
// 📢 Send notification to all students
// =======================================
async function sendToAll() {
  console.log("send to all called")

  //Get Input Values
  const title = document.getElementById("title").value.trim();
  const message = document.getElementById("message").value.trim();

  //Validation
  if (!title || !message) {
    alert("Enter title and message");
    return;
  }

  // Combine title + message into one string (stored in DB)
  const combined = `${title}||${message}`; 

  const token = localStorage.getItem("token");

// Send request to backend
  await fetch("https://backend-ehm8.onrender.com/api/notifications/send-all", {
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

// Reload notifications list
  loadNotifications(); 
}

// =======================================
// ❌ Delete notification
// =======================================
async function deleteNotification(id) {
  const confirmDelete = confirm("Delete this notification?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

// Send DELETE request
  await fetch(`https://backend-ehm8.onrender.com/api/notifications/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert("Deleted ✅");

    // Reload notifications
  loadNotifications();
}

// =======================================
// 📥 Load all notifications 
// =======================================
async function loadNotifications() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://backend-ehm8.onrender.com/api/notifications/all", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  const container = document.getElementById("notificationList");

  // Clear existing UI
  container.innerHTML = "";

  // Loop through notifications
  data.forEach(n => {

    let title = "";
    let message = n.message;

   // Split stored message into title + body
    if (n.message.includes("||")) {
      const parts = n.message.split("||");
      title = parts[0];
      message = parts[1];
    }

     // Format date
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
// Create notification card UI
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

// =======================================
// 🚀 Load notifications on page load
// =======================================
window.addEventListener("DOMContentLoaded", loadNotifications);
