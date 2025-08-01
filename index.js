// Tab switching logic
document.getElementById("loginTab").addEventListener("click", () => {
  document.getElementById("loginFormHtml").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("forgotForm").style.display = "none";
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("signupTab").classList.remove("active");
});

document.getElementById("signupTab").addEventListener("click", () => {
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("loginFormHtml").style.display = "none";
  document.getElementById("forgotForm").style.display = "none";
  document.getElementById("signupTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
});

document.getElementById("forgot").addEventListener("click", () => {
  document.getElementById("forgotForm").style.display = "block";
  document.getElementById("loginFormHtml").style.display = "none";
  document.getElementById("signupForm").style.display = "none";
});

particlesJS.load('particles-js', 'particles.json', () => {
  console.log('Particles.js config loaded');
});


document.getElementById("sendOtpBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Please fill in name and email.");
    return;
  }

  try {
    const res = await fetch("https://backend-ehm8.onrender.com/api/auth/send-otp-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const data = await res.json();
    if (res.ok) {
      alert("OTP sent to email");
      document.getElementById("signupOtp").style.display = "block";
      document.getElementById("password").style.display = "block";
      document.getElementById("passLabel").style.display = "block";
      document.getElementById("createAccountBtn").style.display = "block";
      document.getElementById("name").style.display = "none";
      document.getElementById("nameLab").style.display = "none";
      document.getElementById("email").style.display = "none";
      document.getElementById("emailLab").style.display = "none";
      document.getElementById("sendOtpBtn").style.display = "none";
      document.getElementById("signUpOtpLab").style.display = "block";
    } else {
      alert(data.message || "Failed to send OTP");
    }
  } catch (err) {
    console.error("Send OTP error:", err);
    alert("Something went wrong");
  }
});

document.getElementById("signupFormHtml").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const otp = document.getElementById("signupOtp").value;

  try {
    const res = await fetch("https://backend-ehm8.onrender.com/api/auth/verify-otp-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, otp })
    });

    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user?.id || '');
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error("Signup error:", err);
  }
});


// 🔐 Login form handler
document.getElementById("loginFormHtml").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPass').value;

  try {
    const res = await fetch('https://backend-ehm8.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user?.id || ''); // Optional: update this if your backend sends user

      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
  }
});
document.getElementById("checkResultBtn").addEventListener("click", async () => {
  const enrollNo = document.getElementById("studentEnrollInput").value.trim();

  if (!enrollNo) {
    alert("Please enter your enrollment number.");
    return;
  }

  try {
    const res = await fetch(`https://backend-ehm8.onrender.com/api/results/public/${enrollNo}`);
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("enrollNo", enrollNo);
      window.location.href = "singleResult.html"; // ✅ redirect to result page
    } else {
      alert(data.message || "Result not found.");
    }
  } catch (err) {
    console.error("Check result error:", err);
    alert("Something went wrong.");
  }
});
document.getElementById("forgotFormHtml").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value;
  const otpField = document.getElementById("otp");
  const newPassField = document.getElementById("newPassword");

  // 1️⃣ First phase: Send OTP
  if (otpField.style.display === "none") {
    try {
      const res = await fetch("https://backend-ehm8.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        alert("OTP sent to your email.");
        otpField.style.display = "block";
        newPassField.style.display = "block";
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Forgot error:", err);
      alert("Something went wrong.");
    }

  } else {
    // 2️⃣ Second phase: Verify OTP and reset password
    const otp = otpField.value;
    const newPassword = newPassField.value;

    try {
      const res = await fetch("https://backend-ehm8.onrender.com/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password reset successful! Please login.");
        window.location.reload(); // reload to go back to login
      } else {
        alert(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Something went wrong.");
    }
  }
});