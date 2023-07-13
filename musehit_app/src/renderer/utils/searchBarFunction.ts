/********* Search Bar Function  ************/

import { Album } from "../renderer";
import { showAllAlbums } from "./showAlbums";

const searchBarFunction = (albums: Album) => {
    const searchInput = document.querySelector(
    "[data-search]"
    ) as HTMLInputElement | null;
    const dataAlbumContainer = document.querySelector(
    "[data-album-cards-container]"
    ) as HTMLInputElement | null;
    

    searchInput.addEventListener("input", (e) => {
        const value = (e.target as HTMLInputElement | null)?.value.toLowerCase();
        // const targetCard = document.getElementsByClassName("album-card");
        let dataFromSearchByArtists: Array<string>,
          dataFromSearchByReleaseDate: Array<string>,
          dataFromSearchByAlbums: Array<string> = [];
     

        
        if (value.length >= 2) {
            let result = []
            dataFromSearchByArtists = versions.searchByArtists(value);
            dataFromSearchByAlbums = versions.searchByAlbums(value);
            dataFromSearchByReleaseDate = versions.searchByReleaseDate(value);
            result = [
              ...new Set([
                ...dataFromSearchByArtists,
                ...dataFromSearchByAlbums,
                ...dataFromSearchByReleaseDate,
              ]),
            ];
            
            showAllAlbums(result);
        } else {
          showAllAlbums(albums)
        }
    });
}

export default searchBarFunction;
