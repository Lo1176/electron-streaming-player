/** CREATE ARTIST */
const createArtist = (artistName: string) => {
  versions.addArtist(artistName);
  console.log(`we just created a new artist named ${artistName}`);
};
export default createArtist