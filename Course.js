async function loadCourses() {
  const res = await fetch("http://localhost:5000/api/courses");
  const data = await res.json();
  console.log(data);

  const cardContainer = document.getElementById("courseCards");
  cardContainer.innerHTML = "";

  data.forEach(course => {
    const card = `
      <div class="course-card">
        <div class="card-top">
        <div>
        <h5 class="cardCourseName">${course.course_name}</h5>
        <p class="courseCode"> ${course.course_code}</p>
        </div>

        <p class="courseCodeFloat"> ${course.course_code}</p>

        </div>
         <div>
         <div class="card-middle">
         <p><span class="durationText">Duration</span><span>${course.duration} years</span></p>
         <p><span class="durationText">Students</span><span>${course.student_count || 0}</span></p>
         </div>

         </div>
          <div class=" mt-2 card-bottom">
          <button class="tableBtn del" onclick="deleteCourse(${course.course_id})">
            Delete
          </button>
          <button class="tableBtn edit" onclick="editCourse(${course.course_id})">
            edit
          </button>
          </div>
          
    
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
async function editCourse(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  // Fill modal fields
  document.getElementById("editCourseName").value = data.course_name;
  document.getElementById("editCourseCode").value = data.course_code;
  document.getElementById("editCourseDuration").value = data.duration;

  // store id
  window.editCourseId = id;

  // show modal
  document.getElementById("editCourseModal").style.display = "flex";
}
async function updateCourse() {
  const name = document.getElementById("editCourseName").value;
  const duration = document.getElementById("editCourseDuration").value;

  if (!name || !duration) {
    alert("All fields required");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/courses/update/${window.editCourseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      course_name: name,
      duration: duration
      // ❌ NOT sending course_code
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert("Course updated ✅");

  closeEditModal();
  loadCourses();
}
function closeEditModal() {
  document.getElementById("editCourseModal").style.display = "none";
}
window.onload = loadCourses();