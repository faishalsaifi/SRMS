let selectedRating = 0;

const stars = document.querySelectorAll("#starRating span");

stars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = star.getAttribute("data-value");

    stars.forEach(s => s.classList.remove("active"));

    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value.trim();
 const rating = selectedRating;
  const token = localStorage.getItem("token");

  if (!message || !rating) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/feedback/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message, rating })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Feedback sent ✅");
      document.getElementById("feedbackForm").reset();
      loadMyFeedback(); // refresh list
    } else {
      alert(data.message || "Failed");
    }

  } catch (err) {
    console.error(err);
    alert("Error occurred");
  }
});
async function loadMyFeedback() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/feedback/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const container = document.getElementById("feedbackList");
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No feedback yet</p>";
      return;
    }

    data.forEach(fb => {
      let stars = "★".repeat(fb.rating);

      const card = `
        <div class="card p-2 mb-2">
          <div class="stars">${stars}</div>
          <div class="feedtext">${fb.message}</div>
        </div>
      `;

      container.innerHTML += card;
    });

  } catch (err) {
    console.error(err);
  }
}
window.onload = loadMyFeedback();