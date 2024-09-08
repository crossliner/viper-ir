import { Operation } from "./opcodes.ts";
import { getOparandType, OperandType } from "./OperandTypes.ts";
import { hasAuxiliary } from "./opcodes.ts";

export class Instruction {
	private auxiliary?: number;
	private d?: number;

	constructor(
		private view: DataView
	) {};

	get OP(): Operation {
		return this.view.getUint8(0);
	}

	setDirectJump(d: number) {
		this.d = d;
	}

	getDirectJump(): number {
		return this.d!
	}

	get OparandType(): OperandType {
		return getOparandType(this.OP);
	}

	get A() {
		return this.view.getUint8(1);
	}
	
	get B() {
		return this.view.getUint8(2);
	}
	
	get C() {
		return this.view.getUint8(3);
	}
	
	get D() {
		return this.view.getInt16(2, true);
	}
	
	get E() {
		return this.view.getInt32(1, true);
	}

	setAuxiliary(auxiliary: number) {
		this.auxiliary = auxiliary;
	}

	getAuxiliary() {
		return this.auxiliary
	}

	toString() {
		const op = Operation[this.OP];
		const oparandType = this.OparandType;
	
		// deno-lint-ignore no-explicit-any prefer-const
		let oparands: any = {};
	
		switch (oparandType) {
			case OperandType.None:
				break;
			case OperandType.A:
				oparands.A = this.A;
				break;
			case OperandType.AB:
				oparands.A = this.A;
				oparands.B = this.B;
				break;
			case OperandType.AC:
				oparands.A = this.A;
				oparands.C = this.C;
				break;
			case OperandType.ABC:
				oparands.A = this.A;
				oparands.B = this.B;
				oparands.C = this.C;
				break;
			case OperandType.AD:
				oparands.A = this.A;
				oparands.D = this.D;
				break;
			case OperandType.D:
				oparands.D = this.D;
				break;
			case OperandType.E:
				oparands.E = this.E;
				break;
		};
		
		if (hasAuxiliary(this.OP)) {
			oparands.Auxiliary = this.getAuxiliary();
		};
	
		return `${op} ${Deno.inspect(oparands)}`
	}

	[Symbol.for("Deno.customInspect")]() {
		return this.toString()
	}
};

export function decodeCode(code: Uint32Array): Instruction[] {
	const program = [];

	for (let i = 0; i < code.length; i++) {
		const view = new DataView(code.buffer, (i * 4), 4);
		const instruction = new Instruction(view);

		if (hasAuxiliary(instruction.OP)) {
			instruction.setAuxiliary(code[i += 1]);
		};
		const aux = new DataView(new Uint8Array([Operation.NopAuxiliary, 0, 0, 0]).buffer);
		program.push(instruction);
		
		if (hasAuxiliary(instruction.OP)) program.push(new Instruction(aux));
	};

	return program
}