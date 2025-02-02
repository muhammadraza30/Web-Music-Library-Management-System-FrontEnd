const createAlbumModal = document.getElementById("createAlbumModal");

function openCreateAlbumModal() {
  createAlbumModal.style.display = "flex";
}

function closeCreateAlbumModal() {
  createAlbumModal.style.display = "none";
}

// Close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
  if (e.target === createAlbumModal) {
    closeCreateAlbumModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Modal-related elements
  const createAlbumModal = document.getElementById("createAlbumModal");
  const createAlbumCard = document.getElementById("Albums");
  const closeButton = document.querySelector(".close-button");
  const createAlbumForm = document.getElementById("createAlbumForm");

  // Check if elements exist before adding event listeners
  if (createAlbumCard) {
    createAlbumCard.addEventListener("click", () => {
      if (createAlbumModal) {
        createAlbumModal.style.display = "block";
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      if (createAlbumModal) {
        createAlbumModal.style.display = "none";
      }
    });
  }

  if (createAlbumForm) {
    createAlbumForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const albumTitleElement = document.getElementById("albumTitle");
      const albumReleaseDateElement = document.getElementById("albumReleaseDate");

      console.log("albumTitleElement:", albumTitleElement); // Add this line
      console.log("albumReleaseDateElement:", albumReleaseDateElement); // Add this line

      if (!albumTitleElement) {
        console.error("Element with ID 'albumTitle' not found.");
        alert("Album title input not found. Please check the form.");
        return;
      }

      if (!albumReleaseDateElement) {
        console.error("Element with ID 'albumReleaseDate' not found.");
        alert("Album release date input not found. Please check the form.");
        return;
      }

      const albumTitle = albumTitleElement.value;
      const albumReleaseDate = albumReleaseDateElement.value;
      const username = localStorage.getItem("username");

      try {
        const response = await fetch("http://localhost:8081/createAlbum", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ albumTitle, albumReleaseDate, username }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Album created successfully!");
          if (createAlbumModal) {
            createAlbumModal.style.display = "none";
          }
          createAlbumForm.reset();
          window.location.reload();
        } else {
          alert("Failed to create album: " + result.message);
        }
      } catch (error) {
        console.error("Error creating album:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }
});

const uploadButton = document.getElementById("uploadButton");
const uploadModal = document.getElementById("uploadModal");
const closeModal = document.getElementById("closeModal");

function openUploadModal() {
    uploadModal.style.display = "block";
}
function closeUploadModal() {
    uploadModal.style.display = "none";
} 

window.addEventListener("click", (event) => {
    if (event.target === uploadModal) {
        uploadModal.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", async () => {
  const genreSelect = document.querySelector('select[name="genre_name_for_song"]');
  if (!genreSelect) {
    console.error("Element with name 'genre_name_for_song' not found.");
    return;
  }

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

document.addEventListener("DOMContentLoaded", async () => {
  const languageSelect = document.querySelector('select[name="language_name"]');
  if (!languageSelect) {
    console.error("Element with name 'language_name' not found.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8081/getLanguages");
    if (!response.ok) {
      throw new Error("Failed to fetch languages");
    }

    const languages = await response.json();

    // Populate the dropdown
    languages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.toLowerCase(); // Use a lowercase value for consistency
      option.textContent = language; // Displayed text
      languageSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const albumSelect = document.querySelector('select[name="album_name"]');
  if (!albumSelect) {
    console.error("Element with name 'album_name' not found.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8081/getAlbums");
    if (!response.ok) {
      throw new Error("Failed to fetch albums");
    }

    const albums = await response.json();

    // Populate the dropdown
    albums.forEach((album) => {
      const option = document.createElement("option");
      option.value = album.toLowerCase(); // Use a lowercase value for consistency
      option.textContent = album; // Displayed text
      albumSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
  }
});

// Function to handle form submission
const uploadSongForm = document.getElementById('uploadSongForm');
if (uploadSongForm) {
  uploadSongForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get values from the form fields
    const songTitle = document.getElementById('song_title').value;
    const artist_username = localStorage.getItem("username");
    const albumName = document.getElementById('album_name').value;
    const genreName = document.getElementById('genre_name_for_song').value;
    const languageName = document.getElementById('language_name').value;
    const songLink = document.getElementById('song_link').value;

    // Create a payload object
    const payload = {
      song_title: songTitle,
      artist_username: artist_username,
      album_name: albumName,
      genre_name: genreName,
      language_name: languageName,
      song_link: songLink,
    };

    try {
      // Send the data to the backend
      const response = await fetch('http://localhost:8081/uploadSong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Song uploaded successfully!');
        uploadSongForm.reset(); // Reset the form
        window.location.reload();
      } else {
        const error = await response.text();
        console.error('Upload failed:', error);
        alert('Failed to upload the song.');
      }
    } catch (error) {
      console.error('Error during upload:', error);
      alert('An error occurred while uploading the song.');
    }
  });
}

