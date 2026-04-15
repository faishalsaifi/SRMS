async function loadCourses() {
  try {
    const res = await fetch("http://localhost:5000/api/courses");
    const data = await res.json();

    const container = document.getElementById("courseCards");
    container.innerHTML = "";

    data.forEach(course => {
      const card = `
        <div class="col-md-4 mb-3">

      <div class="course-card">

        <div class="card-top">
          <div>
            <h5 class="cardCourseName">${course.course_name}</h5>
            <p class="courseCode">${course.course_code}</p>
          </div>

          <p class="courseCodeFloat">${course.course_code}</p>
        </div>

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

      container.innerHTML += card;
    });

  } catch (err) {
    console.error(err);
  }
}

window.onload = loadCourses();