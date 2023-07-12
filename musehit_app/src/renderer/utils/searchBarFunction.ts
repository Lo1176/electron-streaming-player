/********* Search Bar Function  ************/

const searchBarFunction = () => {
    const searchInput = document.querySelector(
    "[data-search]"
    ) as HTMLInputElement | null;
    const dataAlbumContainer = document.querySelector(
    "[data-album-cards-container]"
    ) as HTMLInputElement | null;

    searchInput.addEventListener("input", (e) => {
        const value = (e.target as HTMLInputElement | null)?.value.toLowerCase();
        const targetCard = document.getElementsByClassName("album-card");
        let searchDataFiles =[];
        if (value.length >= 2) {
            searchDataFiles = versions.searchData(value);
        }
        return searchDataFiles
    });
}

export default searchBarFunction;
