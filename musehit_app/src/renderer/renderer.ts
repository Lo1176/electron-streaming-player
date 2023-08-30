/******* TYPES tables from DB  *********/
type Album = {
  name?: string;
  artist_id?: number;
  cover?: string;
  release_date?: string;
  genre?: string;
  disk?: string;
  id?: number;
};

type Song = {
  id?: number;
  name?: string;
  path?: string;
  position?: number;
  album_id?: number;
};

type Artist = {
  id?: number;
  name?: string;
};
/** TYPES DB end */

export { Album, Song, Artist };
