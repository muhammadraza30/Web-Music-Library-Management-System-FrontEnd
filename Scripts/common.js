// Logout Functionality
document.getElementById("logoutButton").addEventListener("click", () => {
  // Simulate logout by redirecting to the login page
  window.location.href = "index.html"; // Change to your login page route
});

// Mobile Menu Toggle
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
});
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve full name from localStorage
  const fullName = localStorage.getItem("fullName");

  // Display the full name if available
  if (fullName) {
    document.getElementById("displayname").textContent = "Welcome, " + fullName + " to MusicLoud";
  }
});
//Carousel code 
const imagesContainer = document.querySelector('.carousel-images');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
const images = document.querySelectorAll('.carousel-image');
const totalImages = images.length;

// Move to the next image
function nextImage() {
  currentIndex = (currentIndex + 1) % totalImages;
  updateCarousel();
}

// Move to the previous image
function prevImage() {
  currentIndex = (currentIndex - 1 + totalImages) % totalImages;
  updateCarousel();
}

// Update the carousel to show the current image
function updateCarousel() {
  const offset = -currentIndex * 100;
  imagesContainer.style.transform = `translateX(${offset}%)`;
}

// Event Listeners
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click', prevImage);

// Auto-slide every 5 seconds
setInterval(nextImage, 5000);

//Smooth scroll
document.addEventListener("DOMContentLoaded", () => {
  // Select all nav links
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor behavior

      // Get the target section's ID
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Scroll smoothly to the target section
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start" // Align to the top
        });
      }
    });
  });
});

const InfoModal = document.getElementById("InfoModal");

function openInfoModal() {
  InfoModal.style.display = "flex";
}

function closeInfoModal() {
  InfoModal.style.display = "none";
}

const InfoLink = document.querySelector('.dropdown-menu a[href="#"]');

if (InfoLink) {
  InfoLink.addEventListener("click", (event) => {
    event.preventDefault();
    fetchInfo();
  });
}
// Modify the fetchInfo function to store the information in localStorage
function fetchInfo() {
  const username = localStorage.getItem("username"); // Retrieve username from localStorage
  if (!username) {
    alert("No username found. Please log in.");
    return;
  }

  fetch(`http://localhost:8081/getInfo?username=${encodeURIComponent(username)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Info not found");
      return response.json();
    })
    .then((info) => {
      // Check if response has user or artist data
      if (info.user_full_name) {
        // Populate user info
        InfoList.innerHTML = ` 
          <li><div><h3 class="infos">Name:</h3><h3>${info.user_full_name}</h3></div></li>
          <li><div><h3 class="infos">Email:</h3><h3>${info.user_email}</h3></div></li>
          <li><div><h3 class="infos">Username:</h3><h3>${info.user_username}</h3></div></li>
          <li><div><h3 class="infos">Date Joined:</h3><h3>${info.user_datejoined}</h3></div></li>
        `;
      } else if (info.artist_name) {
        // Populate artist info
        InfoList.innerHTML = ` 
          <li><div><h3 class="infos">Name:</h3><h3>${info.artist_name}</h3></div></li>
          <li><div><h3 class="infos">Email:</h3><h3>${info.artist_email}</h3></div></li>
          <li><div><h3 class="infos">Username:</h3><h3>${info.artist_username}</h3></div></li>
          <li><div><h3 class="infos">Country:</h3><h3>${info.artist_country}</h3></div></li>
          <li><div><h3 class="infos">Debut Year:</h3><h3>${info.artist_debutyear}</h3></div></li>
          <li><div><h3 class="infos">Genre:</h3><h3>${info.genre_name}</h3></div></li>
          <li><div><h3 class="infos">Date Joined:</h3><h3>${info.artist_datejoined}</h3></div></li>
          <li style = "width:90%;"><div style="display=flex; width:90%; gap: 20%;"><div style="width: 50%; gap:10px;"><h3 class="infos" style="width: 122px;">Total Albums:</h3><h3>${info.albums}</h3></div><div style="width: 50%; gap: 10px;"><h3 class="infos" style="width: 122px;">Total Songs:</h3><h3>${info.songs}</h3></div></div></li>
        `;
      }

      // Create an object with the artist's information
      const artistInfo = {
        artist_name: info.artist_name,
        artist_email: info.artist_email,
        artist_username: info.artist_username,
        artist_country: info.artist_country,
        artist_debutyear: info.artist_debutyear,
        artist_password: info.artist_password,
        genre_name: info.genre_name,
        artist_datejoined: info.artist_datejoined
      };

      // Store the object in localStorage as a JSON string
      localStorage.setItem("artistInfo", JSON.stringify(artistInfo));

      // Create an object with the user’s information
      const userInfo = {
        role: "user",
        user_firstname: info.user_firstname,
        user_lastname: info.user_lastname,
        user_fullname: info.user_fullname,
        user_email: info.user_email,
        user_username: info.user_username,
        user_password: info.user_password,
        user_datejoined: info.user_datejoined
      };

      // Store the object in localStorage as a JSON string
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      openInfoModal();
    })
    .catch((error) => {
      alert(error.message);
    });
}

window.addEventListener("click", (e) => {
  if (e.target === InfoModal) {
    closeInfoModal();
  }
  else if (e.target === document.getElementById("SettingsModal")) {
    closeSettingsModal();
  }
});


// In the openSettingsModal function, retrieve the data from localStorage
function SettingsModal() {
  const modal = document.getElementById("SettingsModal");
  modal.style.display = "block";

  const username = localStorage.getItem("username"); // Retrieve username from localStorage

  // Retrieve the stored data from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const artistInfo = JSON.parse(localStorage.getItem("artistInfo"));
  console.log(artistInfo ? artistInfo.artist_username : "No artist info");
  console.log(userInfo ? userInfo.user_username : "No user info");
  console.log(userInfo ? userInfo.user_firstname : "No user info");
  console.log(userInfo ? userInfo.user_lastname : "No user info");
  console.log(username);
  if (userInfo && userInfo.user_username === username) {
    openEditUserModal(userInfo);
  } else if (artistInfo && artistInfo.artist_username === username) {
    openEditArtistModal(artistInfo);
  } else {
    fetch(`http://localhost:8081/getInfo?username=${encodeURIComponent(username)}`)
      .then(response => response.json())
      .then(data => {
        if (data.role === "user") {
          openEditUserModal(data);
        } else if (data.role === "artist") {
          openEditArtistModal(data);
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        alert("Failed to load user info.");
      });
  }
}

function openSettingsModal() {
  document.getElementById("SettingsModal").style.display = "block";
  SettingsModal();
}

function closeSettingsModal() {
  document.getElementById("SettingsModal").style.display = "none";
}

//Delete Account
document.getElementById("deleteAccountBtn").addEventListener("click", function () {
  const username = localStorage.getItem("username"); // Retrieve username
  const role = localStorage.getItem("role"); // Retrieve role

  // Validate fields before sending the request
  if (!username || !role) {
    alert("Username or role is missing. Please log in again.");
    return;
  }

  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    const payload = { username, role };
    console.log("Request payload:", payload);

    fetch("http://localhost:8081/deleteAccount", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        alert(data);
        setTimeout(() => {
          window.location.href = "index.html"; // Redirect to home page
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      });
  }
});


// Open modals for editing
function openEditUserModal(userData) {
  document.getElementById("user_email").value = userData.user_email;
  document.getElementById("user_username").value = userData.user_username;
  document.getElementById("user_firstname").value = userData.user_firstname;
  document.getElementById("user_lastname").value = userData.user_lastname;
  document.getElementById("user_password").value = userData.user_password;
  localStorage.setItem("username", userData.user_username);
  document.getElementById("editUserModal").style.display = "block";
}

function openEditArtistModal(artistData) {
  document.getElementById("artist_email").value = artistData.artist_email;
  document.getElementById("artist_username").value = artistData.artist_username;
  document.getElementById("artist_name").value = artistData.artist_name;
  document.getElementById("artist_country").value = artistData.artist_country;
  document.getElementById("artist_debutyear").value = artistData.artist_debutyear;
  document.getElementById("artist_password").value = artistData.artist_password;
  localStorage.setItem("username", artistData.artist_username);
  // Populate genres dropdown and set the current genre
  populateGenresDropdown().then(() => {
    const genreElement = document.getElementById("genre_name");
    if (genreElement) {
      genreElement.value = artistData.genre_name;
    } else {
      console.error("Genre dropdown not found.");
    }
  });

  document.getElementById("editArtistModal").style.display = "block";
}

// Fetch genres and populate dropdown
async function populateGenresDropdown() {
  const genreSelect = document.getElementById("genre_name");
  genreSelect.innerHTML = ""; // Clear existing options

  try {
    const response = await fetch("http://localhost:8081/getGenres");
    const genres = await response.json();

    // Populate the dropdown
    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre; // Use a lowercase value for consistency
      option.textContent = genre; // Displayed text
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

// Close modals
function closeEditUserModal() {
  document.getElementById("editUserModal").style.display = "none";
}

function closeEditArtistModal() {
  document.getElementById("editArtistModal").style.display = "none";
}

// Submit edited user info
const editUserForm = document.getElementById("editUserForm");
if (editUserForm) {
  editUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
      role: "user",
      user_username: formData.get("user_username"),
      user_firstname: formData.get("user_firstname"),
      user_lastname: formData.get("user_lastname"),
      user_email: formData.get("user_email"),
      user_password: formData.get("user_password"),
    };

    try {
      const response = await fetch("http://localhost:8081/updateInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        // Store the updated username in localStorage
        const userInfo = {
          role: "user",
          user_username: userData.user_username,
          user_firstname: userData.user_firstname,
          user_lastname: userData.user_lastname,
          user_email: userData.user_email,
          user_password: userData.user_password,
          user_fullname: userData.user_firstname + " " + userData.user_lastname,
          user_datejoined: localStorage.getItem("user_datejoined")
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("username", userData.user_username); // Update the username in localStorage
        localStorage.setItem("fullName", userData.user_firstname + " " + userData.user_lastname); // Update the username in localStorage

        alert("User info updated successfully.");
        closeEditUserModal();
        window.location.reload();
      } else {
        alert("Failed to update user info: " + result.message);
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

// Submit edited artist info
const editArtistForm = document.getElementById("editArtistForm");
if (editArtistForm) {
  editArtistForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const artistData = {
      role: "artist",
      artist_username: formData.get("artist_username"),
      artist_name: formData.get("artist_name"),
      artist_email: formData.get("artist_email"),
      artist_country: formData.get("artist_country"),
      artist_debutyear: formData.get("artist_debutyear"),
      genre_name: formData.get("genre_name"),
      artist_password: formData.get("artist_password"),
    };

    try {
      const response = await fetch("http://localhost:8081/updateInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artistData),
      });

      const result = await response.json();
      if (response.ok) {
        // Store the updated username in localStorage
        const artistInfo = {
          artist_name: artistData.artist_name,
          artist_email: artistData.artist_email,
          artist_username: artistData.artist_username,
          artist_country: artistData.artist_country,
          artist_debutyear: artistData.artist_debutyear,
          artist_password: artistData.artist_password,
          genre_name: artistData.genre_name,
          artist_datejoined: localStorage.getItem("artist_datejoined")
        };
        localStorage.setItem("artistInfo", JSON.stringify(artistInfo));
        localStorage.setItem("username", artistData.artist_username); // Update the username in localStorage
        localStorage.setItem("fullName", artistData.artist_name); // Update the username in localStorage

        alert("Artist info updated successfully.");
        closeEditArtistModal();
        window.location.reload();
      } else {
        alert("Failed to update artist info: " + result.message);
      }
    } catch (error) {
      console.error("Error updating artist info:", error);
      alert("An error occurred. Please try again.");
    }
  });
}

// Show the modal
function showMessage(type, message) {
  if (type === "success") {
    alert(message);
  } else if (type === "failure") {
    alert(message);
  }
}

// Close modals
function closeModals(modalId) {
  document.getElementById(modalId).style.display = "none";
  closeEditArtistModal();
  window.location.reload();
}

// Add event listeners
document.getElementById("closeSuccessModal").addEventListener("click", () => closeModal("successModal"));
document.getElementById("closeFailureModal").addEventListener("click", () => closeModal("failureModal"));

// Retry button (optional)
document.getElementById("retryButton").addEventListener("click", () => {
  closeModals("failureModal");
  // Add your retry logic here
});

function openListenModal() {
  const songDisplayModal = document.getElementById("songDisplayModal");
  songDisplayModal.style.display = "block";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
}
function closeSongDisplayModal() {
  document.getElementById("songDisplayModal").style.display = "none";
  document.getElementsByTagName("body")[0].style.overflow = "auto";
}