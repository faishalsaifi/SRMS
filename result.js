const courseData = {
  "BCA": { // BCA
    1: [
      'FEG-2: Foundation Course in English-II', 
      'BCS-111: Computer Basics and PC Software',
      'BCS-012: Basic Mathematics',
      'BCSL-013: Computer Basics and PC Software Lab',
      'BEVAE-181: Environmental Studies',
      'BEGLA-136: English at Work Place'
    ],
    2: [
      'MCS-202: Computer Organisation',
      'MCS-203: Operating Systems',
      'MCSL-204: WINDOWS and LINUX Lab',
      'MCS-201: Programming in C and Python',
      'MCSL-205: C and Python Lab'
    ],
  },

  "BCOM": { // BCom
    1: [
      'BCOC-131: Financial Accounting',
      'BCOC-132: Business Organisation and Management',
      'BEVAE-181: Environmental Studies',
      'BEGLA-136: English at the Workplace',
    ],
    2: [
      'BCOC-133: Business Law',
      'BCOC-134: Business Mathematics and Statistics',
      'BCOE-141: Principles of Marketing',
      'BCOE-143: Fundamentals of Financial Management',
    ]
  },

  "BBA": { // BBA
    1: [
      'BBYCT-131: Principles of Management',
      'BBYCT-132: Fundamentals of Accounting',
      'BBYCT-133: Business Communication',
      'BBYCT-134: Business Environment',
      'BEVAE-181: Environmental Studies',
    ],
    2: [
      'BBYCT-135: Business Statistics',
      'BBYCT-136: Business Economics',
      'BBYCT-137: Financial Management',
      'BBYCT-138: Marketing Management',
    ],
  }
};
async function loadCourses() {
  try {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:5000/api/courses", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
const courseSelect = document.getElementById("course");
courseSelect.innerHTML = '<option value="">--Select Course--</option>'
    
    data.forEach(course => {
      const option = document.createElement("option");

      option.value = course.course_id;

      // 🔥 IMPORTANT: store course_code for logic
      option.setAttribute("data-code", course.course_code);

      option.textContent = `${course.course_name} (${course.course_code})`;

      courseSelect.appendChild(option);
    });

  } catch (err) {
    console.error("Error loading courses:", err);
  }
}
function updateSemesters() {
  const semesterSelect = document.getElementById('semester');

  semesterSelect.innerHTML = '<option value="">--Select Semester--</option>';

  // ✅ Fixed 6 semesters for all courses
  for (let i = 1; i <= 6; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Semester ${i}`;
    semesterSelect.appendChild(option);
  }
}
function updateSubjects() {
  const courseSelect = document.getElementById('course');
  const selectedOption = courseSelect.options[courseSelect.selectedIndex];

  const courseCode = selectedOption.getAttribute("data-code")?.toUpperCase().trim();
  const semester = document.getElementById('semester').value;

  const subjectSelect = document.getElementById('subject');
  const manualInput = document.getElementById('manualSubject');

  subjectSelect.innerHTML = '<option value="">--Select Subject--</option>';

  // 🔥 IMPORTANT: if semester not selected → do nothing
  if (!semester) {
    subjectSelect.style.display = "block";
    manualInput.style.display = "none";
    return;
  }

  // RESET
  subjectSelect.style.display = "block";
  manualInput.style.display = "none";

  console.log("CourseCode:", courseCode, "Semester:", semester);

  // ✅ PREDEFINED COURSE
  if (courseData[courseCode] && courseData[courseCode][semester]) {

    courseData[courseCode][semester].forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      subjectSelect.appendChild(option);
    });

    const otherOption = document.createElement('option');
    otherOption.value = "other";
    otherOption.textContent = "Other (Type Manually)";
    subjectSelect.appendChild(otherOption);

  } else {
    // ✅ ONLY DB COURSE → manual
    subjectSelect.style.display = "none";
    manualInput.style.display = "block";
  }
}
document.getElementById("subject").addEventListener("change", function () {
  const manualInput = document.getElementById("manualSubject");

  if (this.value === "other") {
    manualInput.style.display = "block";
  } else {
     manualInput.style.display = "none";
    manualInput.value = "";
  }
});
function calculateGrade(marks) {
  if (marks >= 75) return "A";
  if (marks >= 50) return "B";
  if (marks >= 40) return "C";
  return "F";
}
const marksInput = document.getElementById("marks");
const gradeInput = document.getElementById("grade");

marksInput.addEventListener("input", () => {
  const marks = parseInt(marksInput.value);

  if (!isNaN(marks)) {
    gradeInput.value = calculateGrade(marks);
  } else {
    gradeInput.value = "";
  }
});
async function loadResults() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/results/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    const table = document.getElementById("resultTableBody");
    table.innerHTML = "";
    data.forEach(result => {
      let gradeClass = "";
      let gradeBack ="";
      
      if (result.grade === "A") {
        gradeClass = "grade-a";
        gradeBack = "grade-green";
      } else if (result.grade === "B") {
        gradeClass = "grade-b";
        gradeBack = "grade-blue";
      } else if (result.grade === "C") {
        gradeClass = "grade-c";
        gradeBack = "grade-white";
      }
      else if(result.grade === "F"){
        gradeClass ="grade-f"
        gradeBack ="grade-red"
      }
      const row = `
        <tr>
        <td class="resultEnroll">${result.enrollment_no}</td>
          <td class="resultName">${result.name}</td>
          <td class="resultSub">${result.subject}</td>
           <td class="resultMarks ${gradeClass}">${result.marks}</td>
  <td class="resultGrade ${gradeClass}"><span class="${gradeBack}">${result.grade}</span></td>
          <td class="d-flex gap-2">
            <button class="tableBtn edit" onclick="editResult(${result.result_id})">Edit</button>
            <button class="tableBtn del" onclick="deleteResult(${result.result_id})">Del</button>
          </td>
        </tr>
      `;
      table.innerHTML += row;
      
    });

  } catch (err) {
    console.error("Error loading results:", err);
  }
}
async function deleteResult(id) {
  const confirmDelete = confirm("Delete this result?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/results/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert("Deleted!");
  loadResults();
}
const emailInput = document.getElementById("email");
const nameInput = document.getElementById("studentName");

emailInput.addEventListener("blur", async () => {
  const email = emailInput.value.trim();

  if (!email) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/users/by-email/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    // ❌ If not student
    if (data.role !== "Student") {
      alert("This email does not belong to a student!");
      nameInput.value = "";
      return;
    }

    // ✅ Auto fill name
    nameInput.value = data.name;

  } catch (err) {
    console.error(err);
    alert("Student not found");
    nameInput.value = "";
  }
});
document.querySelector('.add-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const email = document.getElementById('email').value;
   const enrollment_no = document.getElementById('enroll').value;
let subjectDropdown = document.getElementById('subject').value;
let manualSubject = document.getElementById("manualSubject").value.trim();

let subject = "";

// ✅ Priority logic
if (manualSubject !== "") {
  subject = manualSubject;
} else if (subjectDropdown !== "" && subjectDropdown !== "other") {
  subject = subjectDropdown;
}

// ❌ Validation
if (!subject) {
  alert("Please select or enter subject");
  return;
}


  const marks = parseInt(document.getElementById('marks').value);
  const course_id = document.getElementById('course').value;
  const semester = document.getElementById('semester').value;
  const grade = document.getElementById('grade').value;


  try {
    const token = localStorage.getItem('token');

   let url = "http://localhost:5000/api/results/add";
let method = "POST";

// 🔥 If editing → update instead of add
if (window.editingId) {
   const confirmEdit = confirm("Update this result?");
  if (!confirmEdit) return;
  url = `http://localhost:5000/api/results/update/${window.editingId}`;
  method = "PUT";
}
console.log({
  email,
  enrollment_no,
  subject,
  marks,
  course_id,
  semester,
  grade
});
if (!course_id || !semester) {
  alert("Course and Semester are required!");
  return;
} 
const res = await fetch(url, {
  method: method,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    email,
    enrollment_no,
    subject,
    marks,
    course_id,
    semester,
    grade
  })
});

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "failed to submit result");
      return;
    } 
    alert(window.editingId ? "Result updated ✅" : "Result added ✅");
window.editingId = null;

 //✅ Reset form completely
document.querySelector('.add-form').reset();

// ✅ Reset dropdowns properly
document.getElementById("course").value = "";
document.getElementById("semester").innerHTML = '<option value="">--Select Semester--</option>';
document.getElementById("subject").innerHTML = '<option value="">--Select Subject--</option>';

// ✅ Hide manual subject
document.getElementById("manualSubject").style.display = "none";
document.getElementById("manualSubject").value = "";

// ✅ Reset grade
document.getElementById("grade").value = "";

// ✅ Reload courses again
await loadCourses();

// ✅ Reload results table
loadResults();

  } catch (err) {
    console.error(err);
    alert("❌ Failed to submit result");
  }
});
async function editResult(id) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/results/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    // ✅ Fill form
    document.getElementById("enroll").value = data.enrollment_no;
    document.getElementById("marks").value = data.marks;
    document.getElementById("grade").value = data.grade;

    // 🔥 Fill course first
    document.getElementById("course").value = data.course_id;

    // 🔥 Trigger semesters
    updateSemesters();

    // 🔥 Fill semester
    document.getElementById("semester").value = data.semester;

    // 🔥 Trigger subjects
    updateSubjects();

    // 🔥 Handle subject
    const subjectDropdown = document.getElementById("subject");

    if ([...subjectDropdown.options].some(opt => opt.value === data.subject)) {
      subjectDropdown.value = data.subject;
    } else {
      document.getElementById("manualSubject").style.display = "block";
      document.getElementById("manualSubject").value = data.subject;
    }

    // 🔥 IMPORTANT: email (you were missing this)
    document.getElementById("email").value = data.email || "";

    window.editingId = id;

    alert("Edit mode enabled ✏️");

  } catch (err) {
    console.error("Edit error:", err);
  }
}
window.addEventListener("DOMContentLoaded", () => {
  loadCourses();
  loadResults();
});


