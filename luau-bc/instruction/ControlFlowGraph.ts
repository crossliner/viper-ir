import { DirectedGraph } from "../../graphkit/mod.ts";
import { isConditionalOp, isBranchingOp, BasicBlockMap, BasicBlock, isForLoop, isForLoopPrepare } from "./BasicBlock.ts";
import { Operation } from "./opcodes.ts";

export function computeControlFlowGraph(basicBlockMap: BasicBlockMap): DirectedGraph<BasicBlock> {
	const graph = new DirectedGraph<BasicBlock>();
	const basicBlocksList = Array.from(basicBlockMap.values());

	for (const block of basicBlocksList) {
		graph.addVertex(block);
	};

	for (let i = 0; i < basicBlocksList.length; i++) {
		const block = basicBlocksList[i];
		const lastOp = block.getLastOp();

		if (isForLoopPrepare(lastOp.OP)) {
			graph.addEdge(block, basicBlockMap.get(lastOp.getDirectJump())!);
			continue
		}

		if (lastOp.OP == Operation.JumpBack) {
			const header = basicBlockMap.get(lastOp.getDirectJump())!
			//graph.addEdge(header, block);
			graph.addEdge(block, header);
			const prevBlock = basicBlocksList[i - 1];

			if (!graph.getEdges(prevBlock)?.includes(block)) graph.addEdge(prevBlock, block);
			continue
		};
		
		if (!isBranchingOp(lastOp.OP)) { // if it's not a branch op
			const nextBlock = basicBlocksList[i + 1];
			if (nextBlock) graph.addEdge(block, nextBlock);
			continue;
		}

		if (isConditionalOp(lastOp.OP)) { // if it's a conditional op
			graph.addEdge(block, basicBlocksList[i + 1]);
			graph.addEdge(block, basicBlockMap.get(lastOp.getDirectJump())!)
			continue;
		};


		if (isBranchingOp(lastOp.OP)) { // if a direct branching op
			const target = basicBlockMap.get(lastOp.getDirectJump())!;
			const nextBlock = basicBlocksList[i + 1]
			if (isForLoop(block.getLastOp().OP)) graph.addEdge(block, nextBlock);
			graph.addEdge(block, target);
			
			continue;
		};
	};

	return graph;
}