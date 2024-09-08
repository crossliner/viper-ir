import { Instruction } from "./instruction.ts";
import { Operation } from "./opcodes.ts";

export function isBranchingOp(operation: Operation): boolean {
	switch (operation) {
		case Operation.Jump:
		case Operation.JumpBack:
		case Operation.JumpIf:
		case Operation.JumpIfNot:
		case Operation.JumpIfEqual:
		case Operation.JumpIfLessOrEqual:
		case Operation.JumpIfLess:
		case Operation.JumpIfNotEqual:
		case Operation.JumpIfNotLessOrEqual:
		case Operation.JumpIfNotLess:
		case Operation.ForGenericLoop:
		case Operation.ForNumericLoop:
		//case Operation.ForGenericPrepare:
		//case Operation.ForNumericPrepare:
			return true;
		default:
			return false;
	}
};

export function isForLoop(operation: Operation) {
	switch (operation) {
		case Operation.ForGenericLoop:
		case Operation.ForNumericLoop:
			return true;
		default:
			return false;
	}
}

export function isForLoopPrepare(operation: Operation) {
	switch (operation) {
		case Operation.ForGenericPrepare:
		case Operation.ForNumericPrepare:
			return true;
		default:
			return false;
	}
}

export function isConditionalOp(operation: Operation): boolean {
	switch (operation) {
		case Operation.JumpIf:
		case Operation.JumpIfNot:
		case Operation.JumpIfEqual:
		case Operation.JumpIfLessOrEqual:
		case Operation.JumpIfLess:
		case Operation.JumpIfNotEqual:
		case Operation.JumpIfNotLessOrEqual:
		case Operation.JumpIfNotLess:
			return true;
		default:
			return false;
	}
};

export function isBranchingConditionalOp(operation: Operation): boolean {
	switch (operation) {
		case Operation.Jump:
		case Operation.JumpBack:
		case Operation.JumpIf:
		case Operation.JumpIfNot:
		//case Operation.ForGenericPrepare:
		//case Operation.ForNumericPrepare:
		case Operation.ForGenericLoop:
		case Operation.ForNumericLoop:
		case Operation.JumpIfNotEqual:
			return true;
		default:
			return false;
	}
};

function setDirectJumps(instructions: Instruction[]) {
	for (let i = 0; i < instructions.length; i++) {
		const instr = instructions[i];
		if (!isBranchingOp(instr.OP)) continue;

		const D = instr.D;
		instr.setDirectJump(i + D);
	}
}

function patchDirectJumps(instructions: Instruction[]) {
	for (let i = 0; i < instructions.length; i++) {
		const instr = instructions[i];
		if (!isForLoopPrepare(instr.OP) && !isBranchingOp(instr.OP)) continue;

		const D = isBranchingConditionalOp(instr.OP) ? instr.D + 1 : instr.D;

		instr.setDirectJump(i + D);
	}
};

export class BasicBlock {
	constructor(public instructions: Instruction[]) {}

	toString() {
		return this.instructions.join("\n")
	};

	[Symbol.for("Deno.customInspect")]() {
		return this.toString()
	};


	getLastOp(): Instruction {
		const [ lastOp ] = this.instructions.slice(-1);
		return lastOp;
	}
}

function identifyLeaders(instructions: Instruction[]): Set<number> {
	const leaders = new Set<number>();
	leaders.add(1);
	
	for (let i = 0; i < instructions.length; i++) {
		const instr = instructions[i];
		if (!isBranchingOp(instr.OP)) continue;

		const branch = instr.getDirectJump();

		if (isForLoop(instr.OP)) {
			leaders.add(i);
		};
		
		leaders
			.add(branch + 1)
			.add(i + 1);
	};

	return leaders;
}

export type BasicBlockMap = Map<number, BasicBlock>;

export function splitBasicBlocks(ops: Instruction[]): BasicBlockMap {
	const [ ...instructions ] = ops;

	setDirectJumps(instructions);

	const leaders = identifyLeaders(instructions);
	const sortedLeaders = Array.from(leaders.values())
		.toSorted((a, b) => a - b);
	
	const blocks = new Map();
	let currentLeader: number | undefined = 0;

	while (currentLeader !== undefined) {
		const nextLeader = sortedLeaders.shift();
		const block = new BasicBlock(instructions.slice(currentLeader, nextLeader));
		blocks.set(currentLeader, block);
		
		currentLeader = nextLeader;
	}

	patchDirectJumps(instructions);

	return blocks;
};