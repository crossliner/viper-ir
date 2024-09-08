import { dfsPostOrder } from "../mod.ts";
import { DirectedGraph } from "../digraph.ts";

/**
	* Converts the graph into post-order form and returns a list of predecessors for each graph node.
*/
export function toPostOrderPredForm<T>(graph: DirectedGraph<T>): { indexToVertex: T[], predecessors: Array<number[]> } {
	const indexToVertex = new Array<T>();
	const vertexToIndex = new Map<T, number>();
	const predecessors = new Map<T, T[]>();

	for (const key of graph.getVertices()) {
		predecessors.set(key, []);
	}

	// Use DFS to convert the order of nodes into post-order form & to find the predecessors of each node
	dfsPostOrder(graph, (node => {
		vertexToIndex.set(node, indexToVertex.push(node) - 1);

		for (const edge of graph.getEdges(node) || []) {
			predecessors.get(edge)!.push(node);
		}
	}));

	// Convert the map of nodes to their predecessors into an array of arrays of indices representing those nodes
	const predecessorsArray = new Array<number[]>(graph.getSize());
	for (const [node, nodePredecessors] of predecessors) {
		predecessorsArray[vertexToIndex.get(node)!] = 
			nodePredecessors.map(predecessor => vertexToIndex.get(predecessor)!);
	}

	return {
		predecessors: predecessorsArray,
		indexToVertex,
	};
}
