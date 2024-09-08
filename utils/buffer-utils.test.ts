import { assertArrayIncludes, assertStrictEquals } from "@std/assert";
import { it } from "@std/testing/bdd";

import { concat, fill } from "./buffer-utils.ts";

it("concat()", () => {
    const a = new Uint8Array([ 50, 30 ]);
    const b = new Uint8Array([ 31, 16 ]);
    
    const merged = concat(a, b);

    assertArrayIncludes(merged, a);
    assertArrayIncludes(merged, b);
});

it("fill()", () => {
    const filler = fill(5, 69);

    for (const i of filler) {
        assertStrictEquals(i, 69);
    };
});