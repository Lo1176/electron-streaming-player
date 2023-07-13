/********* Search Bar Function  ************/

import { showAllAlbums } from "./showAlbums";

const searchBarFunction = (albums) => {
    const searchInput = document.querySelector(
    "[data-search]"
    ) as HTMLInputElement | null;
    const dataAlbumContainer = document.querySelector(
    "[data-album-cards-container]"
    ) as HTMLInputElement | null;
    

    searchInput.addEventListener("input", (e) => {
        const value = (e.target as HTMLInputElement | null)?.value.toLowerCase();
        // const targetCard = document.getElementsByClassName("album-card");
        let searchDataFiles =[];
     

        
        if (value.length >= 2) {
            searchDataFiles = versions.searchData(value);
            showAllAlbums(searchDataFiles)
        } else {
          showAllAlbums(albums)  
        }
    });
}

export default searchBarFunction;
