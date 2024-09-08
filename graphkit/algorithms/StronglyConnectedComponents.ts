import { DirectedGraph } from "../mod.ts";

type VertexData = {
	lowlink: number,
	onStack: boolean,
};

/** 
 * This implements Robert Tarjan's "Strongly connected components Algorithm"
 * Publication: https://web.archive.org/web/20170829214726id_/http://www.cs.ucsb.edu/~gilbert/cs240a/old/cs240aSpr2011/slides/TarjanDFS.pdf
*/
export function stronglyConnectedComponents<T>(graph: DirectedGraph<T>): Array<T[]> {
	const sccs = new Array<T[]>();
	const data = new Array<VertexData>();
	const stack = new Array<T>();
	const vertexToIndex = new Map<T, number>();
	let index = 0;

	for (const vertex of graph.getVertices()) {
		if (!vertexToIndex.has(vertex)) {
			strongConnect(vertex);
		}
	}

	return sccs;

	/** 
	* A variation on DFS that finds the strongly connected component the given vertex is in. It achieves this by 
	* traversing through each node connected to the initial vertex and finding the vertex with the lowest post-order
	* index connected to it. If at the end of traversal of any given vertex's edges, the smallest vertex the node is
	* connected to (its lowlink) is equal to that of its index, the vertex must have a path back to itself (a cycle) 
	* and a strongly connected component has been found.
	*/
	function strongConnect(vertex: T) {
		const vertexIndex = index++;
		const vertexData = data[vertexIndex] = {
			lowlink: vertexIndex,
			onStack: true,
		};

		stack.push(vertex);
		vertexToIndex.set(vertex, vertexIndex);

		for (const edge of graph.getEdges(vertex) || []) {
			let edgeIndex = vertexToIndex.get(edge);

			if (edgeIndex === undefined) {
				strongConnect(edge);
				edgeIndex = vertexToIndex.get(edge)!;
				vertexData.lowlink = Math.min(vertexData.lowlink, data[edgeIndex].lowlink);
			} else if (edgeIndex < vertexIndex && data[edgeIndex].onStack) {
				vertexData.lowlink = Math.min(vertexData.lowlink, edgeIndex);
			}
		}

		if (vertexIndex === vertexData.lowlink) {
			const scc = new Array<T>();

			let item: T;
			let itemIndex: number;
			do {
				item = stack.pop()!;
				scc.push(item);

				itemIndex = vertexToIndex.get(item!)!;
				data[itemIndex].onStack = false;
			} while (itemIndex !== vertexIndex)

			sccs.push(scc);
		}
	}
}
