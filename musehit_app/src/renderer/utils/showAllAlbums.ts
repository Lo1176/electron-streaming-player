/**
 * function to display all albums
 */

import { Album } from "../renderer";

let albumContainer = document.getElementById("albums-container");
let defaultCover = "default-cover.png";
let allAlbums: Album = versions.findAlbumsOrderedByArtist();

async function showAllAlbums(albums: Album) {
  if (!!albumContainer) {
    albumContainer.innerHTML = "";
    for (let i = 0; i < albums.length; i++) {
      const artistInfo = await versions.findArtistById(albums[i].artist_id);
      const albumCard = document.createElement("div")
        ? document.createElement("div")
        : null;
      const cover = albums[i].cover !== "NULL" ? albums[i].cover : defaultCover;

      if (!!albumCard) {
        albumCard.innerHTML = `
        <div class="album-card">
        <a id='album_${albums[i]}' href="../src/renderer/album.html">
        <img class="album-cover" src="../public/uploads/${cover}" alt="album cover">
        <div class="album-content">
        <h4 class="album-name">${albums[i].name}</h4>
        <p class="album-artiste-name">${artistInfo?.name}</p>
        </div>
        </a>
        `;

        albumCard.addEventListener("click", () => {
          localStorage.setItem("currentAlbum", JSON.stringify(albums[i]));
          localStorage.setItem("currentArtist", JSON.stringify(artistInfo));
        });

        albumContainer?.appendChild(albumCard);
      }
    }
  }
}

showAllAlbums(allAlbums);

export { showAllAlbums, allAlbums, defaultCover };
