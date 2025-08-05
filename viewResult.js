  function renderStudents(data) {
    const container = document.getElementById('studentRows');
    container.innerHTML = '';

    data.forEach(student => {
      const row = document.createElement('div');
      row.className = 'row d-flex justify-content-start align-items-start studentInfo py-2 rounded mb-2';

      row.innerHTML = `
        <div class="col">${student.enrollment_no}</div>
        <div class="col">${student.student_name}</div>
        <div class="col">${student.course}</div>
        <div class="col">${student.semester}</div>
        <div class="col">${student.gender}</div>
        <div class="col">${student.subject}</div>
        <div class="col">
          <button class="btn btn-sm view-btn">View</button>
          <button onclick="deleteResult('${student.id}')" class="btn btn-sm del-btn"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      container.appendChild(row);
    const viewBtn = row.querySelector('.view-btn');
if (viewBtn) {
  viewBtn.addEventListener('click', () => {
    console.log('Clicked View button for enrollment_no:', student.enrollment_no);
    localStorage.setItem('enrollNo', student.enrollment_no);
    window.location.href = `singleResult.html`;
  });
} else {
  console.warn('View button not found for:', student);
}
    });
    
  }
  function setupSorting(data) {
    let currentSortKey = null;
    let sortAsc = true;

    document.querySelectorAll('.clickable').forEach(header => {
      header.addEventListener('click', () => {
        const key = header.dataset.key;

        if (currentSortKey === key) sortAsc = !sortAsc;
        else {
          currentSortKey = key;
          sortAsc = true;
        }

        const sorted = [...data].sort((a, b) => {
          const valA = a[key]?.toString().toLowerCase() || '';
          const valB = b[key]?.toString().toLowerCase() || '';
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

        renderStudents(sorted);
      });
    });
  }
  function setupSearch(data) {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      const filtered = data.filter(s =>
        Object.values(s).some(value =>
          value?.toString().toLowerCase().includes(term)
        )
      );
      renderStudents(filtered);
    });
  }
async function fetchAndRenderResults() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("https://backend-ehm8.onrender.com/api/results/all", {
      headers: {
        Authorization:`Bearer ${token}`
      }
    });
    const data = await res.json();
    renderStudents(data);
    setupSearch(data);   // optional: if you want to reapply search
    setupSorting(data);  // optional: if you want to reapply sorting
  } catch (err) {
    console.error("Error re-fetching results:", err);
    alert("Failed to refresh student results.");
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  

  if (!token) return alert("Token missing. Please login again.");

  // Set user name in UI
  document.getElementById("userName").textContent = userName || '';
  document.getElementById("userNameMob").textContent = userName || '';
  document.getElementById("userNameMobNav").textContent = userName || '';

await fetchAndRenderResults();

  // Logout handler
  document.querySelectorAll("#logoutBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  });
});
async function deleteResult(id) {
 
  const confirmDelete = confirm("Are you sure you want to delete this result?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`https://backend-ehm8.onrender.com/api/results/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Result deleted successfully!");

      // ✅ Re-fetch results and re-render after short delay
      await fetchAndRenderResults();
    } else {
      alert(data.message || "❌ Failed to delete result");
    }

  } catch (err) {
    console.error("Delete error:", err);
    alert("Something went wrong during deletion.");
  }
}
