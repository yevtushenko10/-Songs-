window.onload = async function () {
  var urlParams = new URLSearchParams(window.location.search);
  var title = urlParams.get("title");
  var artist = urlParams.get("artist");

  if (title && artist) {
    document.getElementById("searchQuery").value = `${artist} ${title}`;
    await searchMusic();
  }

  var currentSong = JSON.parse(localStorage.getItem("currentSong"));
  if (currentSong) {
    document.getElementById("audioPlayer").src = currentSong.previewUrl;
    document.getElementById("change_name").innerText = `${currentSong.title} - ${currentSong.artist}`;
  }

  document.body.style.display = "block";

  displayFavoriteSongs();
};

function getCurrentSongInfo() {
  var audioPlayer = document.getElementById("audioPlayer");
  var infoElement = document.getElementById("change_name");
  return `${infoElement.innerText} - ${audioPlayer.src}`;
}

function addToFavorites() {
  var currentSongInfo = getCurrentSongInfo();

  var favSongs = JSON.parse(localStorage.getItem("favSongs")) || [];

  if (!favSongs.includes(currentSongInfo)) {
    favSongs.push(currentSongInfo);

    localStorage.setItem("favSongs", JSON.stringify(favSongs));

    displayFavoriteSongs();
  }
}

async function searchMusic() {
  var searchQuery = document.getElementById("searchQuery").value;
  var apiUrl = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + encodeURIComponent(searchQuery);

  var response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
      'X-RapidAPI-Key': ' ', // Paste your API KEY
    },
  });

  var data = await response.json();
  displayResults(data.data);
}

function displayResults(songs) {
  var audioPlayer = document.getElementById("audioPlayer");
  var imageElement = document.getElementById("change_img");
  var infoElement = document.getElementById("change_name");

  if (songs.length > 0) {
    var firstSong = songs[0];
    audioPlayer.src = firstSong.preview;

    if (firstSong.album && firstSong.album.cover) {
      imageElement.src = firstSong.album.cover;
    } else {
      imageElement.src = "/photo/default_image.jpg";
    }

    var trackInfo = `${firstSong.artist.name} - ${firstSong.title}`;
    infoElement.innerText = trackInfo;

    displayTrackList(songs.slice(0, 6));
  } else {
    alert("No songs found");
  }
}

function playPause() {
  var audioPlayer = document.getElementById("audioPlayer");
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function displayTrackList(songs) {
  var trackListElement = document.getElementById("tracklist");
  trackListElement.innerHTML = "";

  if (songs.length > 0) {
    songs.forEach(song => {
      var listItem = document.createElement("li");
      listItem.textContent = song.title;
      listItem.addEventListener("click", function () {
        playTrack(song);
        updateTrackInfo(song);
      });
      trackListElement.appendChild(listItem);
    });
  } else {
    alert("No tracks found for the specified artist");
  }
}

function playTrack(song) {
  var audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.src = song.preview;
  audioPlayer.play();
}

function updateTrackInfo(song) {
  var imageElement = document.getElementById("change_img");
  var infoElement = document.getElementById("change_name");

  if (song.album && song.album.cover) {
    imageElement.src = song.album.cover;
  } else {
    imageElement.src = "/photo/default_image.jpg";
  }

  var trackInfo = `${song.artist.name} - ${song.title}`;
  infoElement.innerText = trackInfo;

  displayFavoriteSongs();
}

function displayFavoriteSongs() {
  var favSongsElement = document.getElementById("fav_songs");
  favSongsElement.innerHTML = "";

  var favSongs = JSON.parse(localStorage.getItem("favSongs")) || [];

  favSongs.forEach(songInfo => {
    var [artist, title, previewUrl] = songInfo.split(" - ");
    var link = document.createElement("a");
    link.href = "/pages/main.html";
    link.textContent = `${artist} - ${title}`;

    link.addEventListener("click", function (event) {
      event.preventDefault();
      playFavoriteSong({ artist, title, previewUrl });
    });

    favSongsElement.appendChild(link);
  });
}

function playFavoriteSong(song) {
  var queryParams = `?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`;
  window.location.href = `/pages/main.html${queryParams}`;
}

function clearFavorites() {
  localStorage.removeItem("favSongs");
  displayFavoriteSongs();
}

function clearLastSong() {
  var favSongs = JSON.parse(localStorage.getItem("favSongs")) || [];

  if (favSongs.length > 0) {
    favSongs.pop();
    localStorage.setItem("favSongs", JSON.stringify(favSongs));
    displayFavoriteSongs();
  } else {
    alert("No songs in the list");
  }
}
