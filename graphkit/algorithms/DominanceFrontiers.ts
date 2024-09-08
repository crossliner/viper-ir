import { immediateDominators } from "./ImmediateDominators.ts";
import { DirectedGraph } from "../digraph.ts";
import { toPostOrderPredForm } from "./utils.ts";

/** 
* Computes the dominance frontiers of a vertex in the given directed graph.
* This implements Dominance Frontiers based from the same paper by Keith D. Cooper.
* Publication: http://www.hipersoft.rice.edu/grads/publications/dom14.pdf
*/
export function dominanceFrontiers<T>(graph: DirectedGraph<T>, idoms?: Map<T, T>): Map<T, Set<T>> {
    // Initialise the dominance frontiers set for each vertex in the graph
    const dominanceFrontiers = new Map<T, Set<T>>();
    for (const vertex of graph.getVertices()) {
        dominanceFrontiers.set(vertex, new Set());
    }

    // NOTE: It might be a good idea to be able to pass the post order form results into the immidiateDominators
    // function, but that is a job for another time and I realise that this is most certainly "good enough".
    idoms ||= immediateDominators(graph);
    const { indexToVertex, predecessors } = toPostOrderPredForm(graph);

    // We skip the firt vertex here but that's OK because it has less than 2 predecessors AND it cannot possibly
    // have a dominance frontier since it dominates the entire graph.
    for (let i = 0; i < indexToVertex.length - 1; i++) {
        const vertex = indexToVertex[i];
        const vertexPredecessors = predecessors[i];
        if (vertexPredecessors.length < 2) {
            continue;
        }

        const idom = idoms.get(vertex);
        for (const predecessor of vertexPredecessors) {
            let runner = indexToVertex[predecessor];
            while (runner !== undefined && runner !== idom) {
                dominanceFrontiers.get(runner)!.add(vertex);
                runner = idoms.get(runner)!;
            }
        }
    }

    return dominanceFrontiers;
}
