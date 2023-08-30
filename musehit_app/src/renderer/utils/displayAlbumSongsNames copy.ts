/**
 *  function to display songs of an album
 */

import { Album, Artist, Song } from "./../renderer";
import { playThisSong } from "./playerFunctions";
import { defaultCover } from "./showAllAlbums";
// import { currentArtist, currentAlbum } from "./showAllAlbums";
const currentAlbum: Album = JSON.parse(localStorage.getItem("currentAlbum"));
const currentArtist: Artist = JSON.parse(localStorage.getItem("currentArtist"));

let allSongsFromCurrentAlbum: Song = undefined;
let totalTracks = undefined;

const songsList = document.getElementById("songs-list");
const displayAlbum = document.getElementById("selected-album-container");
// display selected album
const albumCard = document.createElement("div")
  ? document.createElement("div")
  : null;
const cover = currentAlbum.cover !== "NULL" ? currentAlbum.cover : defaultCover;
// <a id='album_${currentAlbum}' href="#songs-list">
if (!!albumCard) {
  albumCard.innerHTML = `
  <div class="album-page-card">
  <img class="album-cover" src="./../../public/uploads/${cover}" alt="album cover">
  <div class="album-page-content">
  <h2 class="album-name">${currentAlbum.name}</h2>
  <p class="album-artiste-name">${currentArtist.name}</p>
  <p>${versions.findAllSongsByAlbumID(currentAlbum.id).length} titres</p>
  </div>
  </a>
  `;
}
displayAlbum?.appendChild(albumCard);
// function displayTotalAlbumTime() {} // nice to have
function displayAlbumSongsNames(album: Album) {
  // 1. show selected album title + ... ${album.cover} .release_date .name .artist_id ...
  allSongsFromCurrentAlbum = !!album
    ? versions.findAllSongsByAlbumID(album.id)
    : null;
  totalTracks = allSongsFromCurrentAlbum.length;

  // if (!!songsList) songsList.innerHTML = "";
  const divAllSongs = document.createElement("div");
  divAllSongs.classList.add("display-all-songs");

  // divAllSongs.setAttribute("id", "theSongList"); // maybe add a class but not an id

  // list all allSongsFromCurrentAlbum
  for (let i = 0; i < allSongsFromCurrentAlbum.length; i++) {
    const divSong = document.createElement("div");
    divSong.classList.add("song-info");
    divSong.innerHTML = `
      <div class="content-overlay"></div>
      <div>
        <img class="album-cover album-cover-thumb" src='./../../public/uploads/${album.cover}' alt="album cover">
      </div>
      <p class="song-name">${allSongsFromCurrentAlbum[i].name}</p>
      `;

    const btnOver = document.getElementById("btn-over") as HTMLElement;

    divSong.addEventListener("click", () => {
      localStorage.setItem(
        "currentSong",
        JSON.stringify(allSongsFromCurrentAlbum[i])
      );
      const currentSong: Song = JSON.parse(localStorage.getItem("currentSong"));
      console.log(
        "🚀 ~ file: displayAlbumSongsNames.ts:70 ~ divSong.addEventListener ~ currentSong:",
        currentSong
      );

      playThisSong();
    });

    !!btnOver &&
      divSong.addEventListener("mouseover", () => {
        btnOver.style.opacity = "1";
      });

    divAllSongs.appendChild(divSong);
  }

  songsList.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
}

if (!!songsList) displayAlbumSongsNames(currentAlbum);

export { displayAlbumSongsNames, totalTracks };
