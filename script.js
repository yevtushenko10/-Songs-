window.onload = async function () {
    var urlParams = new URLSearchParams(window.location.search);
    var title = urlParams.get("title");
    var artist = urlParams.get("artist");
  
    // Проверка наличия параметров и автоматическое заполнение формы
    if (title && artist) {
      document.getElementById("searchQuery").value = `${artist} ${title}`;
  
      // Выполнение поиска асинхронно
      await searchMusic();
    }
  
    // Показываем страницу после выполнения поиска
    document.body.style.display = "block";
  };
  
  // Получаем информацию о текущей песне из localStorage
  var currentSong = JSON.parse(localStorage.getItem("currentSong"));
  
  // Проверяем, есть ли информация о текущей песне
  if (currentSong) {
    // Применяем информацию о песне к вашему плееру и т.д.
    document.getElementById("audioPlayer").src = currentSong.previewUrl;
    document.getElementById(
      "change_name"
    ).innerText = `${currentSong.title} - ${currentSong.artist}`;
  }
  
  function getCurrentSongInfo() {
    var audioPlayer = document.getElementById("audioPlayer");
    var infoElement = document.getElementById("change_name");
    return `${infoElement.innerText} - ${audioPlayer.src}`;
  }
  
  function addToFavorites() {
    var currentSongInfo = getCurrentSongInfo();
  
    // Получение массива избранных песен из localStorage
    var favSongs = JSON.parse(localStorage.getItem("favSongs")) || [];
  
    // Проверка, чтобы не добавлять одну и ту же песню
    if (!favSongs.includes(currentSongInfo)) {
      favSongs.push(currentSongInfo);
  
      // Сохранение обновленного списка избранных песен в localStorage
      localStorage.setItem("favSongs", JSON.stringify(favSongs));
  
      // Обновление отображения избранных песен
      displayFavoriteSongs();
    }
  }
  
  async function searchMusic() {
      // Ваша реализация функции поиска
      var searchQuery = document.getElementById("searchQuery").value;
      var apiUrl = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + encodeURIComponent(searchQuery);
  
      var response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
              'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
              'X-RapidAPI-Key': 'd2322adde1mshe948ebadaf36d3fp11b821jsn54b3f19d019e', // Замените на свой API-ключ
          },
      });
  
      var data = await response.json();
      displayResults(data.data);
  }
  
  function displayResults(songs) {
      // Ваша реализация функции отображения результатов
      var audioPlayer = document.getElementById("audioPlayer");
      var imageElement = document.getElementById("change_img");
      var infoElement = document.getElementById("change_name");
      var trackListElement = document.getElementById("tracklist");
  
      if (songs.length > 0) {
          var firstSong = songs[0];
          audioPlayer.src = firstSong.preview;
  
          // Проверка наличия изображения в треке
          if (firstSong.album && firstSong.album.cover) {
              var imageUrl = firstSong.album.cover;
              imageElement.src = imageUrl;
          } else {
              // Если изображение отсутствует, вы можете использовать изображение по умолчанию
              imageElement.src = "./photo/default_image.jpg";
          }
  
          // Замена названия трека и исполнителя
          var trackInfo = `${firstSong.artist.name} - ${firstSong.title}`;
          infoElement.innerText = trackInfo;
  
          // Вывод списка треков (первые 6)
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
    trackListElement.innerHTML = ""; // Очистка предыдущего списка
  
    if (songs.length > 0) {
      songs.forEach((song, index) => {
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
  
    // Проверка наличия изображения в треке
    if (song.album && song.album.cover) {
      var imageUrl = song.album.cover;
      imageElement.src = imageUrl;
    } else {
      // Если изображение отсутствует, вы можете использовать изображение по умолчанию
      imageElement.src = "./photo/default_image.jpg";
    }
  
    // Замена названия трека и исполнителя
    var trackInfo = `${song.artist.name} - ${song.title}`;
    infoElement.innerText = trackInfo;
  
    // Вызываем функцию отображения избранных песен при загрузке скрипта
    displayFavoriteSongs();
  }
  
  // Вызываем функцию отображения избранных песен при загрузке скрипта
  displayFavoriteSongs();
  