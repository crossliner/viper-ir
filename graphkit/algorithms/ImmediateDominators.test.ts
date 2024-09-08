import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { DirectedGraph } from "../digraph.ts";

import { immediateDominators } from "./ImmediateDominators.ts";

describe("ImmediateDominators", () => {
    it("irreducible CFG", () => {
        /* The following graph in post-order
                6
               / \
              5   4
             /   / \
            1 = 2 = 3
        */
        const graph = new DirectedGraph<string>([
            ["A", ["B", "C"]],
            ["B", ["D"]],
            ["C", ["E", "F"]],
            ["E", ["F", "D"]],
            ["D", ["E"]],
            ["F", ["E"]]
        ]);

        assertEquals(immediateDominators(graph), new Map([
            ["B", "A"],
            ["C", "A"],
            ["D", "A"],
            ["E", "A"],
            ["F", "A"],
        ]));
    });

    it("nested if statements CFG", () => {
        /* The following graph in post-order
                6
               / \
              4   5
             / \  |
            3   2 |
              \ | /
                1
        */
        const graph = new DirectedGraph([
            [1, [2, 3]],
            [2, [4, 5]],
            [3, 6],
            [4, 6],
            [5, 6],
            [6, []],
        ]);

        assertEquals(immediateDominators(graph), new Map([
            [2, 1],
            [3, 1],
            [6, 1],
            [4, 2],
            [5, 2],
        ]));
    });

    it("complex CFG", () => {
        const graph = new DirectedGraph([
            [0, 1],
            [1, [2, 3]],
            [2, 7],
            [3, 4],
            [4, [5, 6]],
            [5, 7],
            [6, 4],
            [7, []],
        ]);

        assertEquals(immediateDominators(graph), new Map([
            [1, 0],
            [2, 1],
            [3, 1],
            [7, 1],
            [4, 3],
            [5, 4],
            [6, 4],
        ]));
    });
});
