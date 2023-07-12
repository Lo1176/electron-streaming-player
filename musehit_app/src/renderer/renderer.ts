/******* PLAYER INFOS *********/
// if (!!audioPlayer) {
//   var PLAYER = console.log(
//     "🚀 ~ PLAYER_INFO ~ ",
//     "audioPlayer.paused:",
//     audioPlayer.paused,
//     "audioPlayer.currentTime:",
//     audioPlayer.currentTime,
//     "audioPlayer.ended:",
//     audioPlayer.ended,
//     "audioPlayer.readyState:",
//     audioPlayer.readyState
//   );
// }
/** end */

import searchBarFunction from "./utils/searchBarFunction";
import { showAllAlbums } from "./utils/showAlbums";

/******* tables from DB *********/
// type Artist = {
//   id?: number;
//   name?: string;
// }
type Album = {
  name?: string;
  artist_id?: number;
  cover?: string;
  release_date?: string;
  genre?: string;
  disk?: string
  id?: number;
}
type Song = {
  id?: number;
  name?: string;
  path?: string;
  position?: number;
  album_id?: number;
};
/** end */
let albums = versions.findAlbumsByArtist();
searchBarFunction();
// const isSearchAlbums = searchBarFunction();
// console.log("🚀 ~ file: renderer.ts:44 ~ isSearchAlbums:", isSearchAlbums)

/** call functions */
searchBarFunction() !== undefined
  ? showAllAlbums(searchBarFunction())
  : showAllAlbums(albums);

// const allAlbums = document.createElement('ul');
// allAlbums.setAttribute('id', 'allAlbums');


/******** TESTING AREA  ************/
//  const testAllArtists = [
//   {id: 4, name: 'Alabama Shakes'},
//   {id: 2, name: 'Michael Jackson'},
//   {id: 1, name: 'The Beatles'},
//   {id: 3, name: 'Wolfgang Amadeus Mozart'}
//  ]
 


// };
// searchBarFunction();

// const userCardTemplate = document.querySelector("[data-user-template]");
// const userCardContainer = document.querySelector("[data-user-cards-container]");
// const searchInput = document.querySelector("[data-search]");

// let users = [];

// searchInput.addEventListener("input", (e) => {
//   const value = e.target.value.toLowerCase();
//   users.forEach((user) => {
//     const isVisible =
//       user.name.toLowerCase().includes(value) ||
//       user.email.toLowerCase().includes(value);
//     user.element.classList.toggle("hide", !isVisible);
//   });
// });
// fetch("https://jsonplaceholder.typicode.com/users")
//   .then((res) => res.json())
//   .then((data) => {
//     users = data.map((user) => {
//       const card = userCardTemplate.content.cloneNode(true).children[0];
//       const header = card.querySelector("[data-header]");
//       const body = card.querySelector("[data-body]");
//       header.textContent = user.name;
//       body.textContent = user.email;
//       userCardContainer.append(card);
//       return { name: user.name, email: user.email, element: card };
//     });
//   });

export { Album, Song };