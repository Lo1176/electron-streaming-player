/** CREATE SONG */
const createSong = (
  name: string,
  path: string,
  album_id: number,
  position: number
    ) => {
    console.log(
        `L'album ${name} existe déjà dans la DB vérifions si nous avons déjà cette chanson ...\nNEXT STEP create song linked to album id ...\n`
    );
    versions.addSong(name, path, album_id, position);
};

export default createSong