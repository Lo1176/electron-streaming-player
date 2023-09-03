import { describe, expect, test } from "@jest/globals";
import { sum } from "../../renderer/utils/sum";

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});

/* [ROMAIN]
  pas sûr que ce test nous intéresse beaucoup !
*/