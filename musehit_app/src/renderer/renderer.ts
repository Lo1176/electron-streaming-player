
import searchBarFunction from "./utils/searchBarFunction";
import { showAllAlbums } from "./utils/showAlbums";

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

/*******
 *  
 * TYPES tables from DB
 * 
 *  *********/

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

type Artist = {
  id?: number;
  name?: string;
}
/** TYPES DB end */

let albums: Album = versions.findAlbumsOrderedByArtist();
showAllAlbums(albums); 
searchBarFunction(albums);

export { Album, Song, Artist };