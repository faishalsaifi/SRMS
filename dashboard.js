async function fetchUserProfile() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  try {
    const res = await fetch(`https://backend-ehm8.onrender.com/api/users/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("userName").innerText = data.name;
      document.getElementById("userNameMob").innerText = data.name;
      document.getElementById("userNameMobNav").innerText = data.name;
      document.getElementById("userEmail").innerText = data.email;
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
    const res = await fetch('https://backend-ehm8.onrender.com/api/dashboard/stats', {
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

window.onload = () => {
  fetchUserProfile();
  fetchDashboardStats();
};

document.querySelectorAll('.logoutBtn').forEach(button => {
button.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "index.html";
})});
