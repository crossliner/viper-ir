import { DirectedGraph } from "../digraph.ts";

export interface ToString {
	toString(): string,
}

type GraphAttributes = Record<string, string>;

export class DotGraphBuilder {
	private scope = 0;
	private strings = new Array<string>();

	private static ESCAPED_STRINGS: Record<string, string> = {
		"\n": "\\n",
		"\r": "\\r",
		"\"": "\\\"",
	};

	public constructor(graphType: "digraph" | "subgraph") {
		this.strings.push(graphType);
		this.strings.push(" ");
		this.pushScope();
	}

	private escapeString(str: string): string {
		const chars = str.split("");
		const shouldWrap = chars.some(char => char === " " || DotGraphBuilder.ESCAPED_STRINGS[char] !== undefined);
		if (!shouldWrap) {
			return str;
		}

		const filtered = chars.map(char => DotGraphBuilder.ESCAPED_STRINGS[char] ?? char).join("");
		return "\"" + filtered + "\"";
	}

	private addEdgeArray<T extends ToString>(edges: T[]) {
		if (edges.length === 1) {
			const edgeString = this.escapeString(edges[0].toString());
			this.strings.push(edgeString);
			return;
		}

		this.strings.push("{ ");
		for (const edge of edges) {
			const edgeString = this.escapeString(edge.toString());
			this.strings.push(edgeString);
			this.strings.push(" ");
		}
		this.strings.push("}");
	}

	private addAttributes(attributes: {[K: string]: string}, escape: boolean = true) {
		const entries = Object.entries(attributes);
		if (entries.length === 0) {
			return;
		}

		this.strings.push("[");
		for (const [attr, value] of entries) {
			this.strings.push(escape ? this.escapeString(attr) : attr);
			this.strings.push("=");
			this.strings.push(escape ? this.escapeString(value) : value);
			this.strings.push(",");
		}
		this.strings.push("]");
	}

	public addAttributesMain(type: string, attributes: {[K: string]: string}) {
		this.newLine();
		this.strings.push(type);
		this.strings.push(" ");
		this.addAttributes(attributes, false);
	}

	public newLine() {
		this.strings.push("\n");
		this.strings.push("\t".repeat(this.scope));
	}

	public popScope() {
		if (this.scope === 0) {
			throw new Error("Attempted to exit scope which does not exist");
		}

		this.scope--;
		this.newLine();
		this.strings.push("}");
	}

	public pushScope() {
		this.strings.push("{");
		this.scope++;
	}

	public addVertex<T extends ToString>(vertex: T, attributes: GraphAttributes = {}) {
		this.newLine();
		this.strings.push(this.escapeString(vertex.toString()));
		this.strings.push(" ");
		this.addAttributes(attributes);
	}

	public addEdges<T extends ToString>(vertex: T, edges: T[], attributes: GraphAttributes = {}) {
		this.newLine();
		this.strings.push(this.escapeString(vertex.toString()));
		this.strings.push(" -> ");
		this.addEdgeArray(edges);
		this.addAttributes(attributes);
	}

	public finish(): string {
		this.popScope();
		return this.strings.join("");
	}
}

export function generateDotForDiGraph<T extends ToString>(graph: DirectedGraph<T>): string {
	const builder = new DotGraphBuilder("digraph");
	builder.addAttributesMain("node", { shape: "box", style: "filled", ordering: "out", fillcolor: "\"#FBE78E\""});

	const vertices = graph.getVertices();
	const vertexToId = new Map<T, number>();
	for (let i = 0; i < vertices.length; i++) {
		vertexToId.set(vertices[i], i);
	}
	
	for (const vertex of vertices) {
		const myId = vertexToId.get(vertex)!;
		const edges = graph.getEdges(vertex) || [];
		const prettyString = Deno.inspect(vertex, { compact: false });
		builder.addVertex(myId, {label: prettyString});
		builder.addEdges(myId, edges.map(edge => vertexToId.get(edge)!));
	}

	return builder.finish();
}