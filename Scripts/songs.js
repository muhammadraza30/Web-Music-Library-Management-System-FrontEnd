let songs = [];
document.addEventListener("DOMContentLoaded", () => {
    const songsContainer = document.getElementById("songsContainer");
    const searchBar = document.getElementById("searchBar");
    const sortOptions = document.getElementById("sortOptions");
    const genreOptions = document.getElementById("genreOptions");
    const languageOptions = document.getElementById("languageOptions");
    let filteredSongs = [];
    let genres = new Set();
    let languages = new Set();
    const role = localStorage.getItem("role");

    // Fetch and display songs
    function fetchSongs() {
        const username = localStorage.getItem("username");

        if (!username) {
            console.error("Error: Username is missing. Please log in.");
            return;
        }

        fetch(`http://localhost:8081/getSongs?username=${encodeURIComponent(username)}&role=${encodeURIComponent(role)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Read the JSON body stream once
            })
            .then(data => {
                console.log("Fetched songs:", data); // Log the parsed JSON object
                songs = data.songs || []; // Store the fetched songs in the global variable
                songs.forEach(song => {
                    genres.add(song.genre_name);
                    languages.add(song.language_name); // Ensure correct property name
                });
                populateFilterOptions();
                filteredSongs = songs; // Initialize filteredSongs with all songs
                displaySongs(filteredSongs);
            })
            .catch(error => {
                console.error("Error fetching songs:", error.message);
            });
    }

    // Populate filter options
    function populateFilterOptions() {
        genreOptions.innerHTML = '<option value="">Filter by Genre</option>';
        genres.forEach(genre => {
            genreOptions.innerHTML += `<option value="${genre}">${genre}</option>`;
        });
        languageOptions.innerHTML = '<option value="">Filter by Language</option>';
        languages.forEach(language => {
            languageOptions.innerHTML += `<option value="${language}">${language}</option>`;
        });
    }

    // Display songs
    function displaySongs(songs) {
        songsContainer.innerHTML = "";
        if (songs.length === 0) {
            songsContainer.innerHTML = "<p style='text-align: center;'>No songs found.</p>";
            return;
        }
        songs.forEach((song, index) => {
            const songDiv = document.createElement("div");
            songDiv.classList.add("song");
            songDiv.innerHTML = `
                <div class = "s-no">${index + 1}</div>
                <div>${song.song_title}</div>
                <div>${song.artist_name}</div>
                <div>${song.album_name}</div>
                <div>${song.genre_name}</div>
                <div>
                    <button onclick="playSong('${song.song_link}')">
                        <svg height="35px" width="35px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-10.24 -10.24 532.48 532.48" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="4.096"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"><rect x="-10.24" y="-10.24" width="532.48" height="532.48" rx="266.24" fill="#222" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.024"></g><g id="SVGRepo_iconCarrier"> <polygon style="fill:#FFFFFF;" points="187.368,146.928 187.368,355.8 382.992,251.368 "></polygon> <path style="fill:#f50057;" d="M256,0.376C114.616,0.376,0,114.824,0,256s114.616,255.624,256,255.624S512,397.176,512,256 S397.384,0.376,256,0.376z M184.496,146.928l195.624,104.44L184.496,355.8V146.928z"></path> </g></svg>
                    </button>
                    ${role === 'artist' ? `
                    <button onclick="editSong('${song.song_title}')">
                        <svg width="35px" height="35px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#050505" stroke-width="0.24000000000000005"></g><g id="SVGRepo_iconCarrier"> <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#f50057" stroke-width="1.6799999999999997" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#f50057" stroke-width="1.6799999999999997" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </button>
                    <button onclick="deleteSong('${song.song_title}')">
                        <svg width="35px" height="35px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.096"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#f50057" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#f50057" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#f50057" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#f50057" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#f50057" stroke-width="1.296" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </button>
                    ` : ''}
                </div>
            `;
            songsContainer.appendChild(songDiv);
        });
    }

    // Filter songs based on selected genre and language
    function filterSongs() {
        const selectedGenre = genreOptions.value;
        const selectedLanguage = languageOptions.value;

        filteredSongs = songs.filter(song => {
            const matchesGenre = selectedGenre ? song.genre_name === selectedGenre : true;
            const matchesLanguage = selectedLanguage ? song.language_name === selectedLanguage : true;
            return matchesGenre && matchesLanguage;
        });

        displaySongs(filteredSongs);
    }

    // Search songs
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const searchedSongs = filteredSongs.filter(song => 
            song.song_title.toLowerCase().includes(query) ||
            song.artist_name.toLowerCase().includes(query) ||
            song.album_name.toLowerCase().includes(query) ||
            song.genre_name.toLowerCase().includes(query)
        );
        displaySongs(searchedSongs);
    });

    // Sort songs
    sortOptions.addEventListener("change", () => {
        const sortBy = sortOptions.value;
        const sortedSongs = [...filteredSongs].sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
        displaySongs(sortedSongs);
    });

    // Filter songs by genre
    genreOptions.addEventListener("change", filterSongs);

    // Filter songs by language
    languageOptions.addEventListener("change", filterSongs);

    // Fetch songs on page load
    fetchSongs();
});

// Example implementations for play, edit, and delete (modify as needed)
function playSong(songLink) {
    const playSongModal = document.getElementById("playSong");
    const modalContent = playSongModal.querySelector(".modal-content");
    modalContent.innerHTML = `
        <span class="close-btn" onclick="closePlaySongModal()">&times;</span>
        <h1>Playing Song</h1>
        <iframe id="songIframe" style="border-radius:12px" src="${songLink}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    `;
    playSongModal.style.display = "block";
}

function closePlaySongModal() {
    const playSongModal = document.getElementById("playSong");
    const songIframe = document.getElementById("songIframe");
    if (songIframe) {
        songIframe.src = ""; // Stop the song from playing
    }
    playSongModal.style.display = "none";
}

function openEditSongModal(songData) {
    const editSongModal = document.getElementById("editSongModal");
    document.getElementById("edit_song_title").value = songData.song_title;
    document.getElementById("edit_album_name").value = songData.album_name.toLowerCase();
    document.getElementById("edit_genre_name_for_song").value = songData.genre_name.toLowerCase();
    document.getElementById("edit_language_name").value = songData.language_name.toLowerCase();
    document.getElementById("edit_song_link").value = songData.song_link;
    console.log(songData);
    editSongModal.style.display = "block";
}

function closeEditSongModal() {
    document.getElementById("editSongModal").style.display = "none";
}

document.getElementById("editSongForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const songData = {
        artist_username: localStorage.getItem("username"),
        song_title: formData.get("edit_song_title"),
        artist_name: localStorage.getItem("fullName"),
        album_name: formData.get("edit_album_name"),
        genre_name: formData.get("edit_genre_name_for_song"),
        language_name: formData.get("edit_language_name"),
        song_link: formData.get("edit_song_link"),
    };

    try {
        const response = await fetch("http://localhost:8081/updateSong", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(songData),
        });

        if (response.ok) {
            alert("Song updated successfully!");
            closeEditSongModal();
            window.location.reload();
        } else {
            const result = await response.json();
            alert("Failed to update song: " + result.message);
        }
    } catch (error) {
        console.error("Error updating song:", error);
        alert("An error occurred. Please try again.");
    }
});

function editSong(songTitle) {
    const songData = songs.find(song => song.song_title === songTitle);
    if (songData) {
        openEditSongModal(songData);
    } else {
        console.error("Error: Song not found.");
        alert("Failed to find song data. Please try again.");
    }
}

function deleteSong(songTitle) {
    if (confirm("Are you sure you want to delete this song?")) {
        fetch(`http://localhost:8081/deleteSong?title=${encodeURIComponent(songTitle)}`, {
            method: "DELETE"
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                window.location.reload();
            })
            .catch(error => {
                console.error("Error deleting song:", error);
                alert("Failed to delete song. Please try again.");
            });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const genreSelect = document.querySelector('select[name="edit_genre_name_for_song"]');
    if (!genreSelect) {
        console.error("Element with name 'edit_genre_name_for_song' not found.");
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
    const languageSelect = document.querySelector('select[name="edit_language_name"]');
    if (!languageSelect) {
        console.error("Element with name 'edit_language_name' not found.");
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
    const albumSelect = document.querySelector('select[name="edit_album_name"]');
    if (!albumSelect) {
        console.error("Element with name 'edit_album_name' not found.");
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
