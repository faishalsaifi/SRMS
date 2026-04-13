async function loadCourses() {
  const res = await fetch("http://localhost:5000/api/courses");
  const data = await res.json();
  console.log(data);

  const cardContainer = document.getElementById("courseCards");
  cardContainer.innerHTML = "";

  data.forEach(course => {
    const card = `
      <div class="col-md-6 mb-3 course-card">
        
          <h5>${course.course_name}</h5>
          <p><strong>Code:</strong> ${course.course_code}</p>
          <p><strong>Duration:</strong> ${course.duration} years</p>
          <p><strong>Student:</strong> ${course.student_count || 0}</p>
          
          <button class="btn btn-danger btn-sm" onclick="deleteCourse(${course.course_id})">
            Delete
          </button>
    
      </div>
    `;
    cardContainer.innerHTML += card;
  });
}

// ➕ Add course
document.getElementById("courseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const course_name = document.getElementById("courseName").value;
  const course_code = document.getElementById("courseCode").value;
  const duration = document.getElementById("duration").value;

  const res = await fetch("http://localhost:5000/api/courses/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ course_name, course_code, duration })
  });

  const data = await res.json();

  alert(data.message);
  loadCourses();
});

// ❌ Delete
async function deleteCourse(id) {
  const confirmDelete = confirm("Delete this course?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/courses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  loadCourses();
}

window.onload = loadCourses();