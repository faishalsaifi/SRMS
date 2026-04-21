// ==============================
// 📥 LOAD ALL FEEDBACK (ADMIN VIEW)
// ==============================
async function loadAllFeedback() {
  const token = localStorage.getItem("token");//JWT Token

   // 🔄 Fetch all feedback from backend
  const res = await fetch("https://backend-ehm8.onrender.com/api/feedback/all", {
    headers: {
      Authorization: `Bearer ${token}` //protected route
    }
  });

  const data = await res.json();

  const container = document.getElementById("adminFeedbackList");
  container.innerHTML = "";//clear previous list

  // 🔁 Loop through feedback data
  data.forEach(fb => {

    // ⭐ Generate star rating
    const stars = "★".repeat(fb.rating);

     // 🧾 Create feedback card UI
    const card = `
      <div class="card p-2 feedbackCard">
        <div style="display:flex; justify-content:space-between;">
          <p class="feedName">${fb.name}</p>
          <button onclick="deleteFeedback(${fb.feedback_id})" class="tableBtn del"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>
        </div>
      <div class="d-flex flex-row-reverse justify-content-end align-items-center gap-2">
      <div class="stars">${stars}</div>
      <div class="feedtext">${fb.message}</div>
      </div>

       
      </div>
    `;

    // ➕ Append card to container
    container.innerHTML += card;
  });
}
// ==============================
// ❌ DELETE FEEDBACK
// ==============================
async function deleteFeedback(id) {
  const confirmDelete = confirm("Delete this feedback?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

   // 🔄 Call delete API
  await fetch(`https://backend-ehm8.onrender.com/api/feedback/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert("Deleted ✅");
   // 🔁 Reload feedback list after delete
  loadAllFeedback();
}
// ==============================
// 🚀 INITIAL LOAD
// ==============================
window.onload = () => {
  loadAllFeedback();// load all feedback on page load
};