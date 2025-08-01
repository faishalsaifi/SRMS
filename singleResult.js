document.addEventListener("DOMContentLoaded", async () => {
  const enrollNo = localStorage.getItem("enrollNo");
  const infoDiv = document.getElementById("studentInfo");
  const resultRows = document.getElementById("resultRows");

  if (!enrollNo) {
    alert("Enrollment number not found. Please go back and try again.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    // ✅ Use public or protected endpoint based on token
    let url = `https://backend-ehm8.onrender.com/api/results/public/${enrollNo}`;
    let options = {};

    if (token) {
      url = `https://backend-ehm8.onrender.com/api/results/by-enroll/${enrollNo}`;
      options.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const res = await fetch(url, options);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      infoDiv.innerHTML = `<p>No results found</p>`;
      return;
    }

    const student = data[0]; // Show general info once

    infoDiv.innerHTML = `
      <p><strong>Name:</strong> ${student.student_name}</p>
      <p><strong>Enrollment No:</strong> ${student.enrollment_no}</p>
      <p><strong>Course:</strong> ${student.course}</p>
    `;

    data.forEach(result => {
      const row = document.createElement("div");
      row.classList.add("result-row", "result-body-row");

      row.innerHTML = `
        <div>${result.subject}</div>
        <div>${result.marks}</div>
        <div>100</div>
        <div>${result.status}</div>
      `;

      resultRows.appendChild(row);
    });
  } catch (err) {
    console.error("Error fetching result:", err);
    infoDiv.innerHTML = `<p>Error loading result</p>`;
  }
});
