import { DirectedGraph } from "../digraph.ts";
import { TreeNode } from "../tree.ts";
import { toPostOrderPredForm } from "./utils.ts";

/** 
* Finds the intersection of the dominators of two nodes
*/
function intersect(doms: number[], fingerA: number, fingerB: number): number {
	while (fingerA !== fingerB) {
		if (fingerA < fingerB)
			fingerA = doms[fingerA];
		else if (fingerB < fingerA)
			fingerB = doms[fingerB];
	}
	return fingerA;
}

/* 
* Computes the immediate dominator of every node in a directed graph.
* This implements Keith D. Cooper's "A Simple, Fast Dominance Algorithm".
* Publication: http://www.hipersoft.rice.edu/grads/publications/dom14.pdf
*/
export function immediateDominators<T>(graph: DirectedGraph<T>): Map<T, T> {
	const { predecessors, indexToVertex } = toPostOrderPredForm(graph);
	const entryIndex = indexToVertex.length - 1;

	const doms = new Array<number>(indexToVertex.length);
	doms[entryIndex] = entryIndex;

	let changed = true;
	while (changed) {
		changed = false;
		
		// For each node which is not the first, find the intersection of each dominator of that node and set the
		// dominator of the node to this node if it is not already equal to the intersection.
		for (let i = entryIndex - 1; i > -1; i--) {
			const newIDom = predecessors[i]
				.filter(predecessor => doms[predecessor] !== undefined)
				.reduce((accumulator, predecessor) => 
						accumulator !== undefined ? intersect(doms, accumulator, predecessor) : predecessor);

			if (doms[i] !== newIDom) {
				doms[i] = newIDom;
				changed = true;
			}
		}
	}

	// Convert the dominator nodes back into vertex form from index form
	const domMap = new Map<T, T>();
	for (let i = 0; i < doms.length; i++) {
		if (i === entryIndex) continue;
		domMap.set(indexToVertex[i], indexToVertex[doms[i]]);
	}
	return domMap;
}

/** 
* Computes the tree of dominators for the given directed graph
*/
export function dominatorTree<T>(graph: DirectedGraph<T>): TreeNode<T> {
	const idoms = immediateDominators(graph);
	const initialNode = graph.getInitialNode();

	const treeNodeMap = new Map<T, TreeNode<T>>();
	treeNodeMap.set(initialNode, new TreeNode(initialNode));

	for (const [vertex, dom] of idoms) {
		getNode(vertex).setParent(getNode(dom));
	}

	return treeNodeMap.get(initialNode)!;

	function getNode(vertex: T) {
		let node = treeNodeMap.get(vertex);
		if (node === undefined) {
			treeNodeMap.set(vertex, node = new TreeNode<T>(vertex));
		}
		return node;
	}
}

export function dominatorGraph<T>(graph: DirectedGraph<T>): DirectedGraph<T> {
	const idoms = immediateDominators(graph);
	const domGraph = new DirectedGraph<T>();

	for (const vertex of graph.getVertices()) {
		domGraph.addVertex(vertex);
	}

	for (const [vertex, dom] of idoms) {
		domGraph.addEdge(dom, vertex);
	};

	return domGraph;
}