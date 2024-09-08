import { describe, it } from "@std/testing/bdd";
import { DirectedGraph } from "../digraph.ts";
import { bfs } from "./BreadthFirstSearch.ts";
import { assertEquals } from "@std/assert";

describe("BreadthFirstSearch", () => {
	it("visits all possible nodes at the current depth before advancing", () => {
		/* The following is the order in which the nodes should be visited
				1
		  	   / \
			  2 = 3
			 / \ / \
			4  5 6  7
		             \
		              8
		*/
		const graph = new DirectedGraph<string>([
			["A", ["B", "C"]],
			["B", ["D", "E", "C"]],
			["C", ["F", "G", "B"]],
			["G", "H"],
		]);
		const expectedOrder = ["A", "B", "C", "D", "E", "F", "G", "H"];

		const nodes = new Array<string>();
		bfs(graph, node => nodes.push(node));
		assertEquals(nodes, expectedOrder);
	});
});
