// Mobile Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
});

// Get modal elements
const signupModal = document.getElementById("signupModal");
const signinModal = document.getElementById("signinModal");
const successModal = document.getElementById("successModal");
const signin_successModal = document.getElementById("signin-successModal");
const failureModal = document.getElementById("failureModal");
const validationErrorModal = document.getElementById("validationErrorModal");
const otpmessageclosebtn = document.getElementById("otp-successModal");

// Function to open the modal
function openSignupModal() {
  signupModal.style.display = "flex";
  signinModal.style.display = "none";
}

// Function to open the Sign in modal
function openSigninModal() {
  signupModal.style.display = "none";
  signinModal.style.display = "flex";
  successModal.style.display = "none";
}

function closeSignupModal() {
  signupModal.style.display = "none";
}

function closeSigninModal() {
  signinModal.style.display = "none";
}

function goToPreviousStep(stepNumber) {
  // Hide all steps
  const steps = document.querySelectorAll(".signup-step");
  steps.forEach(step => step.classList.add("hidden"));

  // Show the specified step
  document.getElementById(`step${stepNumber}`).classList.remove("hidden");

  // Reset any fields if necessary
  if (stepNumber === 1) {
    // If going back to role selection, reset role and email
    document.getElementById("signupForm").reset();
    document.getElementById("role").value = "";
  } else if (stepNumber === 2) {
    // If returning to email entry, reset fields related to steps beyond OTP
    const otpInput = document.getElementById("otp");
    if (otpInput) otpInput.value = ""; // Clear OTP field
  }
}


window.addEventListener("click", (e) => {
  if (e.target === signinModal) {
    closeSigninModal();
  }
  if (e.target === signupModal) {
    closeSignupModal();
  }
});

// Add event listener for the Sign Up button in the navbar
document.querySelector(".btn-sign-up").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default button behavior
  openSignupModal(); // Open the modal
});

// Add event listener for the Sign In button in the navbar
document.querySelector(".btn-sign-in").addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default button behavior
  openSigninModal(); // Open the modal
});

let role;

// Add click event listener to each button
document.querySelectorAll('.role-btn').forEach(button => {
  button.addEventListener('click', function () {
    // Store the value of the data-role attribute in the role variable
    role = button.getAttribute('data-role');
  });
});

// Handle the signup form submission
document.getElementById("roleInfoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get all role-specific form data
  const formData = new FormData(e.target);
  const formData1 = new FormData(signupForm);
  const email = formData1.get("email");
  // Collect all fields based on the role
  let userData = {};
  if (role === "artist") {
    userData = {
      email: email,
      name: formData.get("name"),
      username: formData.get("artist_username"),
      genre: formData.get("genre"),
      debutyear: formData.get("debutyear"),
      country: formData.get("country"),
      password: formData.get("artist_password"),
      confirmPassword: formData.get("artist_confirmpassword"),
      role: "artist",
    };
  } else if (role === "user") {
    userData = {
      email: email,
      firstname: formData.get("user_firstname"),
      lastname: formData.get("user_lastname"),
      username: formData.get("user_username"),
      password: formData.get("user_password"),
      confirmPassword: formData.get("user_confirmpassword"),
      role: "user",
    };
  }

  // Send data to the backend
  try {
    const response = await fetch("http://localhost:8081/registerUser ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.text();
    if (response.ok) {
      signupModal.style.display = "none"; // Close modal
      successModal.style.display = "flex"; // Show success modal
    } else {
      failureModal.style.display = "flex"; // Show failure modal
    }
  } catch (error) {
    console.error("Error:", error);
    failureModal.style.display = "flex"; // Show failure modal
  }
});

// Utility function to validate email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Regex for valid email
}

// Function to display the validation error modal
function showValidationError(message) {
  document.getElementById("validationErrorMessage").textContent = message; // Set error message
  validationErrorModal.style.display = "flex"; // Show modal
}

// Close Validation Error Modal
document.getElementById("closeValidationErrorModal").addEventListener("click", () => {
  validationErrorModal.style.display = "none";
});

// Retry Validation Button
document.getElementById("retryValidation").addEventListener("click", () => {
  validationErrorModal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", async () => {
  const genreSelect = document.querySelector('select[name="genre"]');

  try {
    const response = await fetch("http://localhost:8081/getGenres");
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }

    const genres = await response.json();

    // Populate the dropdown
    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.toLowerCase(); // Use a lowercase value for consistency
      option.textContent = genre; // Displayed text
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
});

// Handle OTP Modal and Verification
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".signup-step");
  const roleBtns = document.querySelectorAll(".role-btn");
  const signupForm = document.getElementById("signupForm");
  const otpButton = document.getElementById("verifyOtp");
  const roleInfoForm = document.getElementById("roleInfoForm");
  const successModal = document.getElementById("otp-successModal");

  let selectedRole = null;

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("hidden", index !== stepIndex);
    });
  }

  roleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedRole = btn.dataset.role;
      showStep(1); // Show account details step
    });
  });

  // Handle OTP submission
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = signupForm.elements["email"];
    const email = emailInput.value.trim();

    if (!email) {
      showValidationError("Please enter a valid email."); // Show validation error
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, roledata: role }), // Send email as JSON
      });

      const data = await response.json(); // Assuming backend sends a JSON response

      if (response.ok) {
        if (data.message === "Email already exists") {
          showValidationError(data.message); // Show validation error
          emailInput.value = ""; // Clear email field
          emailInput.focus(); // Focus back to the email input
        } else {
          document.getElementById("otp-message").textContent = "OTP Sent Successfully!";
          document.getElementById("otp-successModal").style.display = "flex"; // Show OTP success modal
          setTimeout(() => {
            document.getElementById("otp-successModal").style.display = "none"; // Hide OTP success modal
            showStep(2); // Show OTP verification step
          }, 3000); // 3000 milliseconds = 3 seconds
        }
      } else {
        showValidationError("Failed to send OTP: " + (data.message || "Unknown error")); // Show validation error
      }
    } catch (error) {
      console.error("Error:", error);
      showValidationError("Failed to send OTP. " + error.message); // Include error message in the alert
    }
  });

  // Handle OTP verification
  otpButton.addEventListener("click", () => {
    const otp = document.getElementById("otp").value.trim();
    const email = signupForm.elements["email"].value.trim();

    if (!otp) {
      showValidationError("Please enter the OTP."); // Show validation error
      return;
    }

    fetch(`http://localhost:8081/otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, {
      method: "GET", // Send OTP verification request
    })
      .then((response) => response.text())
      .then((data) => {
        if (data === "OTP Verified Successfully") {
          document.getElementById("otp-message").textContent = data;
          document.getElementById("otp-successModal").style.display = "flex"; // Show OTP success modal
          setTimeout(() => {
            document.getElementById("otp-successModal").style.display = "none"; // Hide OTP success modal
            showStep(3); // Show role-specific information step
            document.getElementById(selectedRole + "Fields").classList.remove("hidden");
          }, 3000); // 3000 milliseconds = 3 seconds
        } else {
          showValidationError("Invalid OTP. Please try again."); // Show validation error
          document.getElementById("otp").value = ""; // Clear OTP input on failure
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showValidationError("Failed to verify OTP."); // Show validation error
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const roleButtons = document.querySelectorAll(".role-btn");
  const artistFields = document.querySelector("#artistFields");
  const userFields = document.querySelector("#userFields");
  const roleInfoForm = document.querySelector("#roleInfoForm");

  roleButtons.forEach(button => {
    button.addEventListener("click", () => {
      const role = button.dataset.role;

      if (role === "artist") {
        artistFields.classList.remove("hidden");
        userFields.classList.add("hidden");
        toggleFields(artistFields, false);
        toggleFields(userFields, true);
      } else if (role === "user") {
        userFields.classList.remove("hidden");
        artistFields.classList.add("hidden");
        toggleFields(userFields, false);
        toggleFields(artistFields, true);
      }
    });
  });

  // Disable/Enable fields
  function toggleFields(container, disable) {
    const inputs = container.querySelectorAll("input, select");
    inputs.forEach(input => {
      if (disable) {
        input.setAttribute("disabled", "true");
      } else {
        input.removeAttribute("disabled");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const closeSuccessModal = document.getElementById("closeSuccessModal");
  if (closeSuccessModal) {
    closeSuccessModal.addEventListener("click", () => {
      const successModal = document.getElementById("signin_successModal");
      if (successModal) {
        successModal.style.display = "none";
      } else {
        console.error("successModal not found in the DOM.");
      }
    });
  } else {
    console.error("closeSuccessModal button not found in the DOM.");
  }

  const signinForm = document.getElementById("signinForm");

  if (signinForm) {
    // Handle the sign-in form submission and get the full name
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      const userCredentials = {
        username: formData.get("username"), // Fetch username/email
        password: formData.get("password"),  // Fetch password
        role: document.querySelector('input[name="role"]:checked').value
      };
      
      console.log("Sending credentials:", userCredentials);

      try {
        const response = await fetch("http://localhost:8081/signInUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userCredentials)
        });

        const result = await response.json();  // Expecting a JSON response

        if (response.ok) {
          // Store the full name in localStorage or sessionStorage
          localStorage.setItem("fullName", result.name);
          localStorage.setItem("username", result.username);
          localStorage.setItem("role", userCredentials.role);
          // Show success modal
          signin_successModal.style.display = "flex";
          signinForm.style.display = "none";

          // Redirect after a short delay
          setTimeout(() => {
            if (userCredentials.role === "user") {
              window.location.href = "userindex.html"; // Redirect to user page
            } else {
              window.location.href = "artistindex.html"; // Redirect to artist page
            }
          }, 3000);
        } else {
          showValidationError("Login Failed: " + result.message);
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        showValidationError("An error occurred while trying to sign in. Please try again.");
      }
    });

  } else {
    console.error("signinForm not found in the DOM.");
  }
});

// Smooth transition for About Us section
document.addEventListener("DOMContentLoaded", () => {
  const aboutUsSection = document.getElementById("aboutUsSection");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutUsSection.classList.add("visible");
        observer.unobserve(aboutUsSection);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(aboutUsSection);
});