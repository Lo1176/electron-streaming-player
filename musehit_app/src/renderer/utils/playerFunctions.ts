// import { Song, Album, Artist } from "../renderer";
// import { totalTracks } from "./displayAlbumSongsNames";

// /**
//  * Footer player
//  */

// const currentAlbum: Album = JSON.parse(localStorage.getItem("currentAlbum"));
// const currentArtist: Artist = JSON.parse(localStorage.getItem("currentArtist"));

// let allSongsFromCurrentAlbum: Song = !!currentAlbum
//   ? versions.findAllSongsByAlbumID(currentAlbum.id)
//   : null;

// const footerPlayer = document.getElementById(
//   "footer-player"
// ) as HTMLImageElement;
// const playBtn = document.getElementById("play")
//   ? (document.getElementById("play") as HTMLImageElement)
//   : null;
// const playIcon = "./../../src/images/play-btn.svg";
// const pauseIcon = "./../../src/images/pause-btn.svg";
// // playBtn.innerHTML = `<i>${playIcon}</i>`;
// const prevBtn = document.getElementById("prev") as HTMLImageElement;
// const nextBtn = document.getElementById("next") as HTMLImageElement;
// const progressContainer = document.getElementById(
//   "progress-container"
// ) as HTMLImageElement;
// const progressBar = document.getElementById("progress-bar") as HTMLImageElement;
// /** display albums name on Homepage */
// const artistName = document.getElementById("artist-name") as HTMLImageElement;
// const songName = document.getElementById("song-name") as HTMLImageElement;
// const infoContentSeparator = document.getElementById(
//   "player-info-content-separator"
// ) as HTMLImageElement;
// // find all albums (first 9)
// if (!!document.getElementById("audioPlayer")) {
//   var audioPlayer = <HTMLVideoElement>document.getElementById("audioPlayer");
// }

// if (!!playBtn) {
//   playBtn.addEventListener("click", () => {
//     // is the song  playing ?
//     const isPlaying = footerPlayer.classList.contains("play");

//     isPlaying ? pauseSong() : playSong();
//   });
// }

// function playSong() {
//   footerPlayer.classList.remove("pause"),
//     footerPlayer.classList.add("play"),
//     (playBtn.src = pauseIcon),
//     audioPlayer.play();
// }

// function pauseSong() {
//   footerPlayer.classList.remove("play"),
//     footerPlayer.classList.add("pause"),
//     (playBtn.src = playIcon),
//     audioPlayer.pause();
// }

// /*********** functions for player **************/
// // play a song
// const playThisSong = () => {
//   const currentSong: Song = JSON.parse(localStorage.getItem("currentSong"));
//   console.log("🚀 ~ file: playerFunctions.ts:3 ~ currentSong:", currentSong);

//   audioPlayer.src = `./../../public/uploads/${currentSong.path}`;
//   playSong();
//   if (currentSong.position === 1) {
//     prevBtn.classList.add("disabled");
//   }
//   if (currentSong.position > 1 && currentSong.position !== totalTracks) {
//     prevBtn.classList.remove("disabled");
//     nextBtn.classList.remove("disabled");
//   }

//   if (currentSong.position === totalTracks) {
//     nextBtn.classList.add("disabled");
//   }

//   // display album information
//   songName.innerText = currentSong.name;
//   infoContentSeparator.innerText = "•";
//   artistName.innerText = currentArtist.name;
// };

// if (!!nextBtn) {
//   nextBtn.addEventListener("click", () => {
//     nextSong();
//   });
// }

// if (!!nextBtn) {
//   prevBtn.addEventListener("click", () => {
//     prevSong();
//   });
// }

// // Count down => time left
// if (!!audioPlayer) {
//   audioPlayer.addEventListener(
//     "timeupdate",
//     function () {
//       var timeLeftElement = document.getElementById("time-left"),
//         songDuration = audioPlayer.duration,
//         currentTime = audioPlayer.currentTime,
//         timeLeft = songDuration - currentTime,
//         s: string | number,
//         m: string | number;

//       s = Math.floor(timeLeft) % 60;
//       m = Math.floor(timeLeft / 60) % 60;

//       s = s < 10 ? "0" + s : s;
//       m = m < 10 ? "0" + m : m;

//       timeLeftElement.innerHTML = m + ":" + s;
//     },
//     false
//   );
// }

// // Count up => duration
// if (!!audioPlayer) {
//   audioPlayer.addEventListener(
//     "timeupdate",
//     function () {
//       const timeLineElement = document.getElementById("duration");
//       const s = Math.floor(audioPlayer.currentTime % 60);
//       const m = Math.floor((audioPlayer.currentTime / 60) % 60);
//       if (s < 10) {
//         timeLineElement.innerHTML = m + ":0" + s;
//       } else {
//         timeLineElement.innerHTML = m + ":" + s;
//       }
//       updateProgressBar(audioPlayer.currentTime, audioPlayer.duration);
//     },
//     false
//   );
// }

// // Next song
// function nextSong() {
//   const currentSong: Song = JSON.parse(localStorage.getItem("currentSong"));

//   let position = (currentSong.position += 1);

//   if (position > totalTracks) {
//     audioPlayer.pause();
//   } else {
//     allSongsFromCurrentAlbum = versions.findAllSongsByAlbumID(
//       currentSong.album_id
//     );
//     allSongsFromCurrentAlbum.filter(
//       (song: { [x: string]: any }) => song["position"] === position
//     )[0];
//     playThisSong();
//   }
// }

// // Prev song
// function prevSong() {
//   const currentSong: Song = JSON.parse(localStorage.getItem("currentSong"));

//   let position = currentSong.position;
//   if (position >= 2) position -= 1;
//   if (position > totalTracks - 1) {
//     audioPlayer.pause();
//   } else {
//     const songs = versions.findAllSongsByAlbumID(currentSong.album_id);
//     allSongsFromCurrentAlbum.filter(
//       (song: { [x: string]: any }) => song["position"] === position
//     )[0];
//     playThisSong();
//   }
// }

// // progress bar
// // 1- convert currentTime en % par rapport à songDuration
// function updateProgressBar(currentTime: number, songDuration: number) {
//   // const { currentTime, songDuration } = e.target;
//   const progressPercent = Math.floor(currentTime * 100) / songDuration;
//   progressBar.style.width = `${progressPercent}%`;
// }

// if (!!progressContainer) {
//   progressContainer.addEventListener("click", playHere);
//   // if we click on the progress bar we can it must change the currentTime
//   function playHere(e: { offsetX: any }) {
//     const width = this.clientWidth;
//     const clickX = e.offsetX;
//     const duration = audioPlayer.duration;

//     audioPlayer.currentTime = (clickX / width) * duration;
//   }
// }

// if (!!audioPlayer) audioPlayer.addEventListener("ended", nextSong);

// export { playThisSong };


/* [ROMAIN]
  // j'ai pas regardé du coup
*/