/** CREATE ALBUM */
const createAlbum = (
  album: string,
  artist_id: string | number,
  release_date: string,
  disk: string,
  genre: string,
  cover: string
) => {
  versions.addAlbum(album, artist_id, release_date, disk, genre, cover);
  console.log(`your album folder named ${album} has been created`);
};
export default createAlbum;