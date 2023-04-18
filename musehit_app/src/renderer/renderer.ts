// find all ALBUMS
const ALBUMS = versions.findAlbumsByArtist();

/** function to display album' songs */
const displayAlbumSongsNames = () => {
  // display songs names
  const containerSongsList = document.getElementById("songs-list");
  // create ul element and set its attributes.
  const ulsongs = document.createElement("ul");
//   ulsongs.setAttribute("style", "padding: 4px; margin: 0;");
  ulsongs.setAttribute("id", "theSongList");

  for (let i = 0; i < ALBUMS.length; i++) {
    // console.log("album.length", versions.findAllSongsByAlbumID(ALBUMS[i].id).length)
    const li = document.createElement("li"); // create li element.
    for (
      let j = 0;
      j < versions.findAllSongsByAlbumID(ALBUMS[i].id).length;
      j++
    ) {
      // li.innerHTML = `<a href='album_${ALBUMS[i].id}'>${ALBUMS[i].name}</a>`;	// assigning text to li using array value.
      li.innerHTML +=
        versions.findAllSongsByAlbumID(ALBUMS[i].id)[j].name + "<br>";
      li.setAttribute("style", "display: block;"); // remove the bullets.
    }

    ulsongs.appendChild(li); // append li to ul.
  }
  containerSongsList.appendChild(ulsongs); // add ul to the container.
};

/** display ALBUMS name on Homepage */
const albumContainer = document.getElementById('albumContainer');
// create ul element and set its attributes.
const ulAlbums = document.createElement('ul');
ulAlbums.setAttribute ('style', 'padding: 0; margin: 4px;');
ulAlbums.setAttribute('id', 'theAlbumList');

for ( let i = 0; i < ALBUMS.length; i++) {
    const li = document.createElement('li');	// create li element.

    // li.innerHTML = `<a href='#album'>${ALBUMS[i].name}</a>`;	// assigning text to li using array value.
    li.innerHTML = `<a id="myLink" title="Click to do something"
    href="#album" onclick="${displayAlbumSongsNames()};return false;">${ALBUMS[i].name}</a>`;	// assigning text to li using array value.
    // li.innerHTML = versions.findAllSongsByAlbumID(ALBUMS[i].id);
    li.setAttribute ('style', 'display: block;');	// remove the bullets.

    ulAlbums.appendChild(li);		// append li to ulAlbums.
}
albumContainer.appendChild(ulAlbums);		// add ul to the albumContainer.




