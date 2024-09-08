import { Module } from "../luau-bc/mod.ts";
import { StreamReader } from "../luau-bc/helpers/stream.ts";
import { splitBasicBlocks } from "../luau-bc/instruction/BasicBlock.ts";
import { computeControlFlowGraph } from "../luau-bc/instruction/ControlFlowGraph.ts";
import { generateDotForDiGraph } from "../graphkit/dot/digraph.ts";
import { dominatorGraph } from "../graphkit/mod.ts";

async function main(args: string[]) {
	const [ file, dom ] = args;

	if (!file) return;

	const buf = await Deno.readFile(file);
	const reader = new StreamReader(buf);
	const module = new Module(reader).decode();

	const mainProto = module.prototypes.mainProto;
	const code = mainProto.code;

	const blocks = splitBasicBlocks(code);
	const graph = computeControlFlowGraph(blocks);
	const domGraph = dominatorGraph(graph);

	const dotFile = generateDotForDiGraph(dom ? domGraph : graph);
	await Deno.stdout.write(new TextEncoder().encode(dotFile));
};

await main(Deno.args);