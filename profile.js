function displayFavoriteSongs() {
    var favSongsElement = document.getElementById("fav_songs");
    favSongsElement.innerHTML = "";

    var favSongs = JSON.parse(localStorage.getItem("favSongs")) || [];

    favSongs.forEach(songInfo => {
        var [artist, title, previewUrl] = songInfo.split(" - ");

        var link = document.createElement("a");
        link.href = "main page.html";
        link.textContent = `${artist} - ${title}`;

        // Добавляем обработчик клика для воспроизведения песни
        link.addEventListener("click", function (event) {
            event.preventDefault();
            playFavoriteSong({ artist, title, previewUrl });
        });

        favSongsElement.appendChild(link);
    });
}

function playFavoriteSong(song) {
  // Передача параметров в URL
  var queryParams = `?title=${encodeURIComponent(
    song.title
  )}&artist=${encodeURIComponent(song.artist)}`;
  window.location.href = `main page.html${queryParams}`;
}

function clearFavorites() {
    localStorage.removeItem("favSongs");
    displayFavoriteSongs();
}

function clearLastSong() {
    // Получение массива избранных песен из localStorage
    var favSongs = JSON.parse(localStorage.getItem("favSongs")) || [];

    // Проверка, есть ли песни в списке
    if (favSongs.length > 0) {
        // Удаляем последнюю песню из списка
        favSongs.pop();

        // Сохранение обновленного списка избранных песен в localStorage
        localStorage.setItem("favSongs", JSON.stringify(favSongs));

        // Обновление отображения избранных песен
        displayFavoriteSongs();
    } else {
        alert("No songs in the list");
    }
}

window.onload = displayFavoriteSongs;