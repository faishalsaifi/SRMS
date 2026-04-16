async function loadAllFeedback() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/feedback/all", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  const container = document.getElementById("adminFeedbackList");
  container.innerHTML = "";

  data.forEach(fb => {

    const stars = "★".repeat(fb.rating);

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

    container.innerHTML += card;
  });
}
async function deleteFeedback(id) {
  const confirmDelete = confirm("Delete this feedback?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/feedback/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert("Deleted ✅");
  loadAllFeedback();
}
window.onload = () => {
  loadAllFeedback();
};