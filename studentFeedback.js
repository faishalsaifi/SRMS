// ==============================
// ⭐ STAR RATING SYSTEM
// ==============================

// Store selected rating value
let selectedRating = 0;

// Get all star elements
const stars = document.querySelectorAll("#starRating span");

// 🔁 Add click event to each star
stars.forEach(star => {
  star.addEventListener("click", () => {
     // ✅ Get rating value from clicked star
    selectedRating = star.getAttribute("data-value");

     // 🔄 Remove active class from all stars
    stars.forEach(s => s.classList.remove("active"));

      // ⭐ Highlight selected stars
    for (let i = 0; i < selectedRating; i++) {
      stars[i].classList.add("active");
    }
  });
});
// ==============================
// 📝 SUBMIT FEEDBACK
// ==============================
document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value.trim();
 const rating = selectedRating; // selected star rating
  const token = localStorage.getItem("token");

  // ❌ Validation
  if (!message || !rating) {
    alert("Please fill all fields");
    return;
  }

  try {
    // 🔄 Send feedback to backend
    const res = await fetch("https://backend-ehm8.onrender.com/api/feedback/add", {
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
      // 🔄 Reset form
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

// ==============================
// 📥 LOAD MY FEEDBACK (STUDENT)
// ==============================
async function loadMyFeedback() {
  const token = localStorage.getItem("token");

  try {
     // 🔄 Fetch logged-in student's feedback
    const res = await fetch("https://backend-ehm8.onrender.com/api/feedback/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const container = document.getElementById("feedbackList");
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = `<p class="empty">No feedback yet</p>`;
      return;
    }

     // 🔁 Loop through feedback
    data.forEach(fb => {
      // ⭐ Convert rating to stars
      let stars = "★".repeat(fb.rating);

      // 🧾 Feedback card UI
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

// ==============================
// 🚀 INITIAL LOAD
// ==============================
window.onload = loadMyFeedback();// load feedback on page load