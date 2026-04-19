// ==============================
// 📚 LOAD COURSES (STUDENT VIEW)
// ==============================
async function loadCourses() {
  try {
     // 🔄 Fetch all courses from backend
    const res = await fetch("http://localhost:5000/api/courses");
    const data = await res.json();

    const container = document.getElementById("courseCards");
    container.innerHTML = "";// clear previous cards

    // 🔁 Loop through courses
    data.forEach(course => {

       // 🧾 Course card UI (read-only view for students)
      const card = `
        <div class="col-sm-6 col-md-4 mb-3">

      <div class="course-card">

       <!-- 📌 Top section (name + code) -->
        <div class="card-top">
          <div>
            <h5 class="cardCourseName">${course.course_name}</h5>
            <p class="courseCode">${course.course_code}</p>
          </div>

          <p class="courseCodeFloat">${course.course_code}</p>
        </div>

        <!-- 📊 Middle section (details) -->
        <div>
          <div class="card-middle">
            <p>
              <span class="durationText">Duration</span>
              <span>${course.duration || "N/A"} years</span>
            </p>

            <p>
              <span class="durationText">Students</span>
              <span>${course.student_count || 0}</span>
            </p>
          </div>
        </div>

      </div>

    </div>
      `;
// ➕ Append card to container
      container.innerHTML += card;
    });

  } catch (err) {
    console.error(err);// ❌ Log error if API fails
  }
}
// ==============================
// 🚀 INITIAL LOAD
// ==============================
window.onload = loadCourses();// load courses on page load