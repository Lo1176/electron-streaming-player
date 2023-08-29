/** CREATE ARTIST */
const createArtist = (artistName: string) => {
  versions.addArtist(artistName);
  console.log(`we've just added a new artist named ${artistName}`);
};
export default createArtist