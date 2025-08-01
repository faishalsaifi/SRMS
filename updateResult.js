const courseData = {
  BCA: {
    1: [
      'FEG-2: Foundation Course in English-II',
      'BCS-111: Computer Basics and PC Software',
      'BCS-012: Basic Mathematics',
      'BCSL-013: Computer Basics and PC Software Lab',
      'BEVAE-181: Environmental Studies',
      'BEGLA-136: English at Work Place',
    ],
    2: ['MCS-011: Computer Fundamentals', 'MCS-012: Mathematics-II', 'MCS-013: Programming in C'],
  },
  BCom: {
    1: ['BCOC-131: Financial Accounting', 'BCOC-132: Business Organisation and Management'],
    2: ['BCOC-133: Business Law', 'BCOC-134: Business Mathematics'],
  },
  BBA: {
    1: ['BBAC-131: Principles of Management', 'BBAC-132: Business Communication'],
    2: ['BBAC-133: Marketing Management', 'BBAC-134: Financial Accounting'],
  },
};

let matchedResultId = null; // Will hold the matched result's DB ID

function updateSemesters() {
  const course = document.getElementById("course").value;
  const semesterSelect = document.getElementById("semester");
  semesterSelect.innerHTML = '<option value="">--Select Semester--</option>';

  if (!courseData[course]) return;

  const semesters = Object.keys(courseData[course]);
  semesters.forEach(sem => {
    const opt = document.createElement("option");
    opt.value = sem;
    opt.textContent = `Semester ${sem}`;
    semesterSelect.appendChild(opt);
  });
}

function updateSubjects() {
  const course = document.getElementById("course").value;
  const semester = document.getElementById("semester").value;
  const subjectSelect = document.getElementById("subject");
  subjectSelect.innerHTML = '<option value="">--Select Subject--</option>';

  if (!courseData[course] || !courseData[course][semester]) return;

  courseData[course][semester].forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subjectSelect.appendChild(opt);
  });
}

// Fetch and fill result for given enrollment + subject
document.getElementById("subject").addEventListener("change", async () => {
  const token = localStorage.getItem("token");
  const enrollment = document.getElementById("enroll").value.trim();
  const subject = document.getElementById("subject").value;
  const course = document.getElementById("course").value;
  const semester = document.getElementById("semester").value;
  const marksInput = document.getElementById("marks");

  if (!enrollment || !subject || !token) return;

  try {
    const res = await fetch(`https://backend-ehm8.onrender.com/api/results/by-enroll/${enrollment}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      const match = data.find(
        (r) => r.subject === subject && r.course === course && r.semester === semester
      );

      if (match) {
        matchedResultId = match.id;
        marksInput.value = match.marks;
      } else {
        matchedResultId = null;
        marksInput.value = '';
        alert("Subject not found for this student.");
      }
    } else {
      matchedResultId = null;
      alert("No result found for this enrollment.");
    }
  } catch (err) {
    console.error("Fetch result error:", err);
    alert("Error fetching result.");
  }
});

// Update result
async function updateResult(event) {
  event.preventDefault();

  const enrollment = document.getElementById("enroll").value.trim();
  const course = document.getElementById("course").value;
  const semester = document.getElementById("semester").value;
  const subject = document.getElementById("subject").value;
  const marks = document.getElementById("marks").value;
  const token = localStorage.getItem("token");

  if (!enrollment || !course || !semester || !subject || marks === "") {
    return alert("Please fill in all fields.");
  }

  try {
    // 🔍 Step 1: Get the result ID from the backend based on enrollment + subject
    const idRes = await fetch(`https://backend-ehm8.onrender.com/api/results/by-enroll/${enrollment}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const results = await idRes.json();
    const result = results.find(r => r.subject === subject && r.course === course && r.semester === semester);

    if (!result) {
      return alert("No result found for this student and subject.");
    }

    // 🛠️ Step 2: Update using PUT
    const updateRes = await fetch(`https://backend-ehm8.onrender.com/api/results/update/${result.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ marks, status: marks >= 40 ? "Pass" : "Fail" })
    });

    const updateData = await updateRes.json();

    if (updateRes.ok) {
      alert(updateData.message || "Result updated successfully.");
    } else {
      alert(updateData.message || "Failed to update result.");
    }

  } catch (err) {
    console.error("Update Result Error:", err);
    alert("An error occurred while updating result.");
  }
}

