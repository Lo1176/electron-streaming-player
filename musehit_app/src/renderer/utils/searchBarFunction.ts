/********* Search Bar Function  ************/

import { Album } from "../renderer";
import { allAlbums, showAllAlbums } from "./showAllAlbums";

const searchBarFunction = (albums: Album) => {
  const searchInput = document.querySelector(
    "[data-search]"
  ) as HTMLInputElement | null;
  const dataAlbumContainer = document.querySelector(
    "[data-album-cards-container]"
  ) as HTMLInputElement | null;

  searchInput.addEventListener("input", (e) => {
    const value = (e.target as HTMLInputElement | null)?.value.toLowerCase();
    /* [ROMAIN]
      pas besoin de toLowerCase si tu le fais en db
    */
    // const targetCard = document.getElementsByClassName("album-card");
    let dataFromSearchByArtists: Array<string>,
      dataFromSearchByReleaseDate: Array<string>,
      dataFromSearchByAlbums: Array<string> = [];

    if (value.length >= 2) {
      let result: any = [];
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
      /* [ROMAIN]
         je pense que tu aurais pu te débrouiller pour faire un 
         seul appel à la db qui checke tout ça plutôt que d'en faire 3 !
      */
    } else {
      showAllAlbums(albums);
    }
  });
};
searchBarFunction(allAlbums);
export default searchBarFunction;
