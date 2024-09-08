import { describe, it } from "jsr:@std/testing@^0.225.3/bdd";
import { assertEquals } from "@std/assert";
import { DirectedGraph } from "../digraph.ts";
import { dfsPostOrder } from "./DepthFirstSearch.ts";

describe("DepthFirstSearch", () => {
	it("Post Order", () => {
		/* The following graph in post-order
				7
			   / \
			  4   6
			 / \   \
			1   3   5
			   /
			  2 
		*/
		const graph = new DirectedGraph<string>([
			["A", ["B", "C"]],
			["B", ["D", "E"]],
			["C", "F"],
			["E", "G"],
		]);
		const expectedOrder = ["D", "G", "E", "B", "F", "C", "A"];

		const orderedNodes = new Array<string>();
		dfsPostOrder(graph, (node => orderedNodes.push(node)));
		assertEquals(expectedOrder, orderedNodes);
	});
});