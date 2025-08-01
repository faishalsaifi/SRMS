const courseData = {
  BCA: {
    1: [
      'FEG-2: Foundation Course in English-II', 
      'BCS-111: Computer Basics and PC Software',
       'BCS-012: Basic Mathematics',
       'BCSL-013: Computer Basics and PC Software Lab',
       'BEVAE-181: Environmental Studies',
       'BEGLA-136: English at Work Place'],
    2: [
      'MCS-202: Computer Organisation',
       'MCS-203: Operating Systems',
        'MCSL-204: WINDOWS and LINUX Lab',
        'MCS-201: Programming in C and Python',
        'MCSL-205: C and Python Lab'],
  },
  
  BCom: {
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
    ]},
  BBA: {
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

function updateSemesters() {
  const course = document.getElementById('course').value;
  const semesterSelect = document.getElementById('semester');
  const subjectSelect = document.getElementById('subject');
  
  // Reset semester and subject
  semesterSelect.innerHTML = '<option value="">--Select Semester--</option>';
  subjectSelect.innerHTML = '<option value="">--Select Subject--</option>';

  if (course && courseData[course]) {
    const semesters = Object.keys(courseData[course]);
    semesters.forEach(sem => {
      const option = document.createElement('option');
      option.value = sem;
      option.textContent = `Semester ${sem}`;
      semesterSelect.appendChild(option);
    });
  }
}

function updateSubjects() {
  const course = document.getElementById('course').value;
  const semester = document.getElementById('semester').value;
  const subjectSelect = document.getElementById('subject');

  subjectSelect.innerHTML = '<option value="">--Select Subject--</option>';

  if (course && semester && courseData[course] && courseData[course][semester]) {
    courseData[course][semester].forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      subjectSelect.appendChild(option);
    });
  }
}
document.querySelector('.add-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    student_name: document.getElementById('name').value,
    enrollment_no: document.getElementById('enroll').value,
    email: document.getElementById('email').value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    course: document.getElementById('course').value,
    semester: document.getElementById('semester').value,
    subject: document.getElementById('subject').value,
    marks: parseInt(document.getElementById('marks').value),
    status: document.querySelector('input[name="status"]:checked').value
  };

  try {
    const token = localStorage.getItem('token');
    const res = await fetch('https://backend-ehm8.onrender.com/api/results/add', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${token}` 
        },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message || "Result added!");
    document.querySelector('.add-form').reset(); // Clear form
  } catch (err) {
    console.error("Result Submit Error:", err);
    alert("Failed to submit result");
  }
});


