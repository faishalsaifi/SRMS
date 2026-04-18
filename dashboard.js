
async function fetchUserProfile() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;

if (!userId) {
  console.error("User ID missing");
  return;
}

  try {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("userName").innerText = data.name;
      document.getElementById("userNameMob").innerText = data.name;
    
    
    } else {
      console.error("Failed to fetch profile:", data.message || data.error);
    }

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function fetchDashboardStats() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch('http://localhost:5000/api/dashboard/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      document.querySelector(".totalStudents").textContent = data.totalStudents;
      document.querySelector(".totalSubjects").textContent = data.totalSubjects;
      document.querySelector(".marksEntered").textContent = data.marksEntered;
      document.querySelector(".resultsGenerated").textContent = data.resultsGenerated;
    } else {
      console.error("Failed to fetch stats:", data.message || data.error);
    }

  } catch (err) {
    console.error("Dashboard stats fetch failed:", err);
  }
}
async function loadRecentResults() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/results/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      const container = document.getElementById("recentResults");
      container.innerHTML = "";

      data.slice(0, 5).forEach(r => {
        const div = document.createElement("div");
        div.className = "result-item d-flex justify-content-between";
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
        div.innerHTML = `
        <div class="recentResult">
        <span>
        <strong>${r.name}</strong> - ${r.subject}
        </span><br>
          <span class="resultMarks ${gradeClass}">Marks : ${r.marks}</span></div>
          <span class="grade my-auto ${gradeClass}"><span class="${gradeBack}">${r.grade}</span></span>
        `;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error("Recent results error:", err);
  }
}
async function loadLatestFeedback() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/feedback/all", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      const container = document.getElementById("latestFeedback");
      container.innerHTML = "";

      data.slice(0, 3).forEach(f => {
        const div = document.createElement("div");
        div.className = "feedback-item";
        const stars ="★".repeat(f.rating || 0)
        div.innerHTML = `
<div class="d-flex flex-column">
<span class="feedMess">  ${f.message}</span>
<span class="feedName">${f.name}</span>
</div>
<span class="stars">${stars}</span>

         
        `;
        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error("Feedback error:", err);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  fetchUserProfile();

  if (document.querySelector(".totalStudents")) {
    fetchDashboardStats();
  }
  // ✅ Only run if section exists
  if (document.getElementById("recentResults")) {
    loadRecentResults();
  }

  if (document.getElementById("latestFeedback")) {
    loadLatestFeedback();
  }
});

document.querySelectorAll('.logoutBtn').forEach(button => {
button.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "index.html";
})});
