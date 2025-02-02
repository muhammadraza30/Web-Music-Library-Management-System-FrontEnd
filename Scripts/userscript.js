function closeSettingsModal() {
  document.getElementById("SettingsModal").style.display = "none";
}
// Function to open the Create Playlist Modal
function openCreatePlaylistModal() {
  document.getElementById('createPlaylistModal').style.display = 'block';

  // Add event listener to the form
  document.getElementById('createPlaylistForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get user input
    const playlistTitle = document.getElementById('playlistTitle').value.trim();

    // Validate inputs
    if (!playlistTitle) {
      alert('Please enter a playlist title.');
      return;
    }

    // Prepare the data to send to the backend
    const requestData = {
      playlist_name: playlistTitle,
      user_username: localStorage.getItem('username') // Assuming username is stored in localStorage
    };

    try {
      // Send the data to the backend
      const response = await fetch('http://localhost:8081/createPlaylist', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Playlist created successfully!');
        closeCreatePlaylistModal();
        window.location.reload();
        // Optionally, refresh playlists or update the UI here
      } else {
        const errorResult = await response.json();
        alert(errorResult.message || 'Failed to create playlist. Please try again.');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('An error occurred. Please try again later.');
    }
  });
}

// Function to close the Create Playlist Modal
function closeCreatePlaylistModal() {
  document.getElementById('createPlaylistModal').style.display = 'none';
}
