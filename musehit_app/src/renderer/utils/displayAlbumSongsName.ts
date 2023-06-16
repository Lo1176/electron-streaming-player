// function displayAlbumSongsNames() {
//   // currentAlbum = localStorage.album
//   allSongsFromCurrentAlbum = versions.findAllSongsByAlbumID(currentAlbum.id);
//   totalTracks = allSongsFromCurrentAlbum.length;

//   if (!!songsList) songsList.innerHTML = "";
//   const divAllSongs = document.createElement("div");
//   // divAllSongs.setAttribute("id", "theSongList"); // maybe add a class but not an id

//   // list all allSongsFromCurrentAlbum
//   for (let i = 0; i < allSongsFromCurrentAlbum.length; i++) {
//     const divSong = document.createElement("div");
//     divSong.setAttribute("class", "song-info");
//     divSong.innerHTML = `
//       <div class="content-overlay"></div>
//       <div>
//         <img class="album-cover album-cover-thumb" src="./../public/uploads/${currentAlbum.cover}" alt="album cover">
//       </div>
//       <div>
//       <div class="toto">
//           <img id='btn-over' class='' src = "./../src/images/play-btn.svg" alt="play button"/>
//       </div>
//       </div>
//       <p class="song-name">${allSongsFromCurrentAlbum[i].name}</p>
//     `;
//     const btnOver = document.getElementById("btn-over") as HTMLElement;
//     divSong.addEventListener("click", () => {
//       currentSong = allSongsFromCurrentAlbum[i];
//       // maybe find a better name than playThisSong => it's confused with playSong
//       playThisSong();
//     });
//     !!btnOver &&
//       divSong.addEventListener("mouseover", () => {
//         btnOver.style.opacity = "1";
//       });

//     divAllSongs.appendChild(divSong);
//   }

//   songsList.appendChild(divAllSongs); // add ul to the container.
//   return totalTracks;
// }

// export default displayAlbumSongsNames;