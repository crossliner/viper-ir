import { ConstantTable, parseConstantTable } from "./constant.ts";
import { Decoder } from "./decoder.ts";
import { ReaderHandle } from "./handle.ts";
import { Instruction, decodeCode } from "../instruction/instruction.ts";

export class Proto implements Decoder {
	public stackSize: number;
	public parameters: number;
	public upvalues: number;
	public variadicArguments: boolean;
	public code: Instruction[];
	public constants: ConstantTable;
	public name: string;
	public lineDefined: number;

	constructor(
		private handle: ReaderHandle
	) {
		this.stackSize = 0;
		this.parameters = 0;
		this.upvalues = 0;
		this.variadicArguments = false;
		this.code = [];
		this.constants = [];
		this.name = "Proto";
		this.lineDefined = 0;
	}

	// TODO: implement proper type parsing
	private decodeTypeHeader() {
		const reader = this.handle.getReader();

		reader.readByte();
		const typeSize = reader.readVarInt();
		if (typeSize > 0) reader.advance(typeSize);
	}

	private decodeCode() {
        const reader = this.handle.getReader();
        const size = reader.readVarInt();
		const buf = reader.readBytes(size * 4);
		
		const code = new Uint32Array(buf.buffer);
		this.code = decodeCode(code);
    };

	private decodeProtos() {
		const reader = this.handle.getReader();
		const sizep = reader.readVarInt();

		for (let i = 0; i < sizep; i++) {
			reader.readVarInt();
		}
	};

	private decodeConstants() { 
		this.constants = parseConstantTable(this.handle);
	};

	private decodeParameters() {
		const reader = this.handle.getReader();

		this.stackSize = reader.readByte();
		this.parameters = reader.readByte();
		this.upvalues = reader.readByte();
		this.variadicArguments = reader.readBool();
	};

	private decodeDebugInfo() {
		const reader = this.handle.getReader();
		const stringTable = this.handle.getStringTable();

		this.lineDefined = reader.readVarInt();
		this.name = stringTable.readString();

		const lineInfo = reader.readBool();
		if (lineInfo) {
			throw new Error("Parser currently doesn't support lineinfo")
		};
	};
	
	decode(): Proto {
		this.decodeParameters();
		this.decodeTypeHeader();
		this.decodeCode();
		this.decodeConstants();
		this.decodeProtos();
		this.decodeDebugInfo();

		return this;
	};
};

export class Prototypes implements Decoder { 
	protos: Proto[];
	mainProto: Proto;

	constructor(
		private handle: ReaderHandle,
	) {
		this.protos = [];
		this.mainProto = new Proto(this.handle)
	};
	
	private decodeProtos() {
		const reader = this.handle.getReader();
		const protoCount = reader.readVarInt();
		
		for (let i = 0; i < protoCount; i++) {
			const proto = new Proto(
				this.handle
			);

			this.protos.push(proto.decode());
		};
	};

	private decodeMainProto() {
		const reader = this.handle.getReader();
		const mainId = reader.readVarInt();

		this.mainProto = this.protos[mainId];
	}

	decode(): Prototypes {
		this.decodeProtos();
		this.decodeMainProto();

		return this;
	}
};