// =======================================
// 📥 Load all courses from backend
// =======================================
async function loadCourses() {
  //Fetch Courses
  const res = await fetch("https://backend-ehm8.onrender.com/api/courses");
  const data = await res.json();
  console.log(data);

  const cardContainer = document.getElementById("courseCards");

//Clear previous cards
  cardContainer.innerHTML = "";

// Loop through courses and create UI cards
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
     // Append card to container
    cardContainer.innerHTML += card;
  });
}
// =======================================
// ➕ Add new course
// =======================================
document.getElementById("courseForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

   // Get form values
  const course_name = document.getElementById("courseName").value;
  const course_code = document.getElementById("courseCode").value;
  const duration = document.getElementById("duration").value;
  
  //Send POST request
  const res = await fetch("https://backend-ehm8.onrender.com/api/courses/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ course_name, course_code, duration })
  });

  const data = await res.json();

  alert(data.message);

  // Reload course list
  loadCourses();
});

// =======================================
// ❌ Delete course
// =======================================
async function deleteCourse(id) {
  const confirmDelete = confirm("Delete this course?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");
  
   // Send DELETE request
  await fetch(`https://backend-ehm8.onrender.com/api/courses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

   // Refresh list
  loadCourses();
}

// =======================================
// ✏️ Open Edit Modal (Fetch course by ID)
// =======================================
async function editCourse(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://backend-ehm8.onrender.com/api/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

 // Fill modal fields with existing data
  document.getElementById("editCourseName").value = data.course_name;
  document.getElementById("editCourseCode").value = data.course_code;
  document.getElementById("editCourseDuration").value = data.duration;

  // Store course ID globally for update
  window.editCourseId = id;

  // show modal
  document.getElementById("editCourseModal").style.display = "flex";
}

// =======================================
// 🔄 Update course
// =======================================
async function updateCourse() {
  const name = document.getElementById("editCourseName").value;
  const duration = document.getElementById("editCourseDuration").value;


  // Validation
  if (!name || !duration) {
    alert("All fields required");
    return;
  }

  const token = localStorage.getItem("token");

  // Send PUT request 
  const res = await fetch(`https://backend-ehm8.onrender.com/api/courses/${window.editCourseId}`, {
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

   // Close modal
  closeEditModal();
   // Refresh course list
  loadCourses();
}

// ❌ Close Edit Modal
function closeEditModal() {
  document.getElementById("editCourseModal").style.display = "none";
}

// 🚀 Initial load when page opens
window.onload = loadCourses();