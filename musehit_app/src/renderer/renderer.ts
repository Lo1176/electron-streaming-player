// find all ALBUMS
const ALBUMS = versions.findAlbumsByArtist();

/** function to display album' songs */
const displayAlbumSongsNames = (album_id) => {
  const containerSongsList = document.getElementById("songs-list"); // display songs names
  containerSongsList.innerHTML = ""; // reset div before feeding it
  const ulSongs = document.createElement("ul"); // create ul element and set its attributes.
  ulSongs.setAttribute("id", "theSongList"); //   ulSongs.setAttribute("style", "padding: 4px; margin: 0;");
// <figure>
//   <figcaption>Listen to the T-Rex:</figcaption>
//   <audio controls src="/media/cc0-audio/t-rex-roar.mp3">
//     <a href="/media/cc0-audio/t-rex-roar.mp3">Download audio</a>
//   </audio>
// </figure>;
  const li = document.createElement("li"); // create li element.
  const songs = versions.findAllSongsByAlbumID(album_id);
  for (let j = 0; j < songs.length; j++) {
    li.innerHTML += `
    <figcaption>${songs[j].name}:</figcaption>
    <audio id="audioPlayer" controls src="./../public/uploads/${songs[j].path}">"${songs[j].name}">
    Your browser does not support the audio element.
         <a href="./../public/uploads/${songs[j].path}">"${songs[j].name} ▶️ "</a>
        </audio>
    `;
    li.setAttribute("style", "display: block;"); // remove the bullets.
  }

  ulSongs.appendChild(li); // append li to ul.
  containerSongsList.appendChild(ulSongs); // add ul to the container.
};

/** display ALBUMS name on Homepage */
const albumContainer = document.getElementById('albumContainer');
// create ul element and set its attributes.
const ulAlbums = document.createElement('ul');
ulAlbums.setAttribute ('style', 'padding: 0; margin: 4px;');
ulAlbums.setAttribute('id', 'theAlbumList');

for ( let i = 0; i < ALBUMS.length; i++) {
    const li = document.createElement('li');	// create li element.

    li.innerHTML = `<a id="myLink" title="Click to do something"
    href="#album">${ALBUMS[i].name}</a>`;	// assigning text to li using array value.
    li.setAttribute ('style', 'display: block;');	// remove the bullets.
    li.addEventListener("click", () => { displayAlbumSongsNames(ALBUMS[i].id);});

    ulAlbums.appendChild(li);		// append li to ulAlbums.
}
albumContainer.appendChild(ulAlbums);		// add ul to the albumContainer.

/** function to play next song at the end of the previous one */

const playNextSong = () => {
  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.addEventListener('ended',function(){
      console.log("this song is finished")
  });

}
