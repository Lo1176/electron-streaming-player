import { describe, expect, test } from "@jest/globals";
import { Album } from "src/renderer/renderer";
import { showAllAlbums } from "../../renderer/utils/showAllAlbums";

describe("show All Albums from db limit 9", () => {
  const testAlbums = [
    {
      name: "Toto",
      artist_id: 1,
      cover: "string/path",
      release_date: "2008",
      genre: "Pop",
      disk: null,
      id: 1,
    },
    {
      name: "Roro",
      artist_id: 1,
      cover: "string/path",
      release_date: "1998",
      genre: "Pop",
      disk: null,
      id: 2,
    },
    {
      name: "Best of Rock",
      artist_id: 14,
      cover: "string/path",
      release_date: "2000",
      genre: "Rock",
      disk: 2,
      id: 3,
    },
    {
      name: "Tron",
      artist_id: 2,
      cover: "string/path",
      release_date: "1972",
      genre: "Electro",
      disk: null,
      id: 24,
    },
  ] as Album;

  test("the array length must be equal to 4", () => {
    expect(console.log(showAllAlbums(testAlbums))).toEqual(4);
  });
});
/* [ROMAIN]
 Ce test fail quand tu lances les tests ! Dommage car c'est ton seul test !
la définition de ta fonction showAllAlbums n'a pas de return, donc renvoie undefined.
 aussi console.log(4) != 4
 et sûrement qu'en .ts (c'est le principe) "4" != 4

 bref, ce test est à repenser !
*/