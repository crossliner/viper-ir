import { DirectedGraph } from "../digraph.ts";

export function bfs<T>(graph: DirectedGraph<T>, callback: (node: T) => void) {
	const visited = new Set<T>();
	let currentNodes = [graph.getInitialNode()];
	let nextNodes = new Array<T>();

	while (currentNodes.length > 0) {
		for (const node of currentNodes) {
			callback(node);

			const edges = graph.getEdges(node) || [];
			for (const edge of edges) {
				if (visited.has(edge)) {
					continue;
				}
				visited.add(edge);

				nextNodes.push(edge);
			}
		}

		currentNodes = nextNodes;
		nextNodes = [];
	}
}

