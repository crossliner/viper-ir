import { DirectedGraph } from "../digraph.ts";

export function dfsPostOrder<T>(	
	graph: DirectedGraph<T>,
	callback: (value: T) => void, 
	node?: T
) {
	const visited = new Set<T>();

	const dfsInner = (startNode: T) => {
		if (visited.has(startNode)) {
			return;
		}
		visited.add(startNode);
		
		const edges = graph.getEdges(startNode) || [];
		for (const edge of edges) {
			dfsInner(edge);
		}
		callback(startNode);
	}

	dfsInner(node ? node : graph.getInitialNode());
};

export function dfs<T>(
	graph: DirectedGraph<T>,
	callback: (value: T) => void, 
	node?: T
) {
	const visited = new Set<T>();

	const dfsInner = (startNode: T) => {
		if (visited.has(startNode)) {
			return;
		}
		visited.add(startNode);
		callback(startNode);
		
		const edges = graph.getEdges(startNode) || [];
		for (const edge of edges) {
			dfsInner(edge);
		}
	}

	dfsInner(node ? node : graph.getInitialNode());
};