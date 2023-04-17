// const toto = JSON.stringify(versions.findAllSongs());
// const toto = versions.findAllSongs();
// console.log("Hello in front", toto["name"])
// console.log
// const test = "Hello";
// document.getElementById("mytext").value = toto;//No

const albums = versions.findAlbumsByArtist();
const containerListing = document.getElementById('container');

// create ul element and set its attributes.
const ul = document.createElement('ul');
ul.setAttribute ('style', 'padding: 0; margin: 0;');
ul.setAttribute('id', 'theList');

for ( let i = 0; i < albums.length; i++) {
    const li = document.createElement('li');	// create li element.

    li.innerHTML = albums[i].name;	                        // assigning text to li using array value.
    li.setAttribute ('style', 'display: block;');	// remove the bullets.

    ul.appendChild(li);		// append li to ul.
}
containerListing.appendChild(ul);		// add ul to the container.
