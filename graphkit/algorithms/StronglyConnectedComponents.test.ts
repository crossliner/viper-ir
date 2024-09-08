import { describe, it } from "@std/testing/bdd";
import { DirectedGraph } from "../digraph.ts";
import { stronglyConnectedComponents } from "./StronglyConnectedComponents.ts";
import { assertArrayIncludes } from "@std/assert";

describe("StronglyConnectedComponents", () => {
	it("finds multiple groups of nodes such that each node in the group has a path to another", () => {
		const graph = new DirectedGraph<string>([
			["A", "B"],

			["B", ["B", "C", "F"]],

			["C", ["D", "E"]],
			["D", ["C", "G", "H"]],

			["E", "F"],
			["F", "E"],

			["G", "H"],
			["H", "I"],
			["I", "G"],
		]);

		assertArrayIncludes(stronglyConnectedComponents(graph), [
			["A"],
			["B"],
			["D", "C"],
			["F", "E"],
			["I", "H", "G"],
		]);
	});
});
