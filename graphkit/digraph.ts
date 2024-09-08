export class DirectedGraph<T> {
	public adjacencies: Map<T, T[]>;

	public constructor(predefinedEdges?: Array<[T, T | T[]]>) {
		this.adjacencies = predefinedEdges 
			? new Map(predefinedEdges.map(edge => !Array.isArray(edge[1]) ? [edge[0], [edge[1]]] : edge))
			: new Map();
	}

	/** Adds a vertex to the graph */
	public addVertex(vertex: T) {
		this.adjacencies.set(vertex, []);
	}

	/** Adds an edge from one vertex to another */
	public addEdge(vertex: T, edge: T) {
		const vert = this.adjacencies.get(vertex);
		if (!vert) return;

		vert.push(edge);
	}

	/** Returns the amount of vertices in the graph */
	public getSize(): number {
		return this.adjacencies.size;
	}

	/** Returns an array of each edge for the given vertex */
	public getEdges(vertex: T): T[] | undefined {
		return this.adjacencies.get(vertex);
	}

	/** Returns an array of each vertex in the graph */
	public getVertices(): T[] {
		return Array.from(this.adjacencies.keys());
	}

	/** Gets the initial node of the Directed Graph */
	public getInitialNode(): T {
		const vertices = new Set(this.getVertices());
		for (const vertex of this.getVertices()) {
			for (const edge of this.getEdges(vertex)!) {
				if (vertices.has(edge)) {
					vertices.delete(edge);
				}
			}
		}

		if (vertices.size != 1) {
			throw new Error(`Expected CFG graph to have only 1 entry node, found ${vertices.size} nodes with no parent`);
		}

		return vertices.values().next().value as T;
	}
}
