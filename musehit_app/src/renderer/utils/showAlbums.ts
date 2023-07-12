/** 
 * function to display all albums
 */

import { displayAlbumSongsNames } from "./displayAlbumSongsNames";

  let albumContainer = document.getElementById("albums-container");
//   let albumName = document.getElementById("album-name");
  let defaultCover = "default-cover.png";
  let currentAlbum = undefined;
  let currentArtist = undefined;

async function showAllAlbums(albums) {
  for (let i = 0; i < albums.length; i++) {
    const artistInfo = await versions.findArtistById(albums[i].artist_id);
    // console.log("🚀 ~ file: renderer.ts:83 ~ showAllAlbums ~ artistInfo:", artistInfo)
    const albumCard = document.createElement("div");
    const cover = albums[i].cover !== "NULL" ? albums[i].cover : defaultCover;
    // <a id='album_${albums[i]}' href="./../src/renderer/album.html">
    albumCard.innerHTML = `
    <a id='album_${albums[i]}' href="#songs-list">
      <div class="album-card">
        <img class="album-cover" src="./../public/uploads/${cover}" alt="album cover">
      <div class="album-content">
        <h4 class="album-name">${albums[i].name}</h4>
        <p class="album-artiste-name">${artistInfo.name}</p>
      </div>
    </a>
    `;
    albumCard.addEventListener("click", () => {
      (currentAlbum = albums[i]),
        (currentArtist = artistInfo),
        displayAlbumSongsNames();
      // localStorage.setItem('album', currentAlbum);
      localStorage.album = currentAlbum;
    });
    albumContainer?.appendChild(albumCard);
  }
}

export { showAllAlbums, currentArtist, currentAlbum };