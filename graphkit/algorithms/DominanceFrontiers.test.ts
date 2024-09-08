import { describe, it } from "jsr:@std/testing@^0.225.3/bdd";
import { assertEquals } from "@std/assert";
import { DirectedGraph } from "../digraph.ts";

import { dominanceFrontiers } from "./DominanceFrontiers.ts";

describe("DominanceFrontiers", () => {      
    it("can calculate the dominance frontiers of a cfg", () => {
        const graph = new DirectedGraph([
            ["A", ["B", "F"]],
            ["B", ["C", "D"]],
            ["C", "E"],
            ["D", "E"],
            ["E", "F"],
            ["F", []],
        ]);

        assertEquals(dominanceFrontiers(graph), new Map<string, Set<string>>([
            ["A", new Set()],
            ["B", new Set(["F"])],
            ["C", new Set(["E"])],
            ["D", new Set(["E"])],
            ["E", new Set(["F"])],
            ["F", new Set([])],
        ]));
    });

    it("accounts for the edge case where a node is its own dominance frontier", () => {
        const graph = new DirectedGraph([
            ["A", "B"],
            ["B", "C"],
            ["C", ["B", "D"]],
            ["D", []],
        ]);

        // This result should be correct as B does not strictly dominate itself & C does not domiante B (for obvious)
        // reasons. A cannot have dominance frontiers as it dominates the entire graph, B cannot have D as its
        // dominance frontier for the same reason.
        assertEquals(dominanceFrontiers(graph), new Map<string, Set<string>>([
            ["A", new Set()],
            ["B", new Set(["B"])],
            ["C", new Set(["B"])],
            ["D", new Set()],
        ]));
    });

    it("can calculate the dominance frontiers of a nested if statement cfg", () => {
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

        assertEquals(dominanceFrontiers(graph), new Map<number, Set<number>>([
            [1, new Set()],
            [2, new Set([6])],
            [3, new Set([6])],
            [4, new Set([6])],
            [5, new Set([6])],
            [6, new Set()],
        ]));
    });
});