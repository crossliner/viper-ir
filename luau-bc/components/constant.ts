import { ReaderHandle } from "./handle.ts";

export enum ConstantType {
	Nil,
	Boolean,
	Number,
	String,
	Import,
	Table,
	Closure,
	Vector
};

export type ConstantId = { id: number }
export type ConstantVector = [ number, number, number, number ];
export type ConstantValueType = undefined | 
	boolean | number | string | 
	ConstantId | ConstantTable | ConstantVector;

export interface ConstantValue {
	type: ConstantType,
	value: ConstantValueType
};

export type ConstantTable = ConstantValue[]

function constantValue(type: ConstantType, value: ConstantValueType): ConstantValue {
	const val = { type, value };
	
	val.toString = function() {
		return `${ConstantType[val.type]} ${val.value}`;
	};

	return val;
};

export function parseConstantTable(handle: ReaderHandle): ConstantTable {
	const reader = handle.getReader();
	const stringTable = handle.getStringTable();

	const constantTableSize = reader.readVarInt();

	// deno-lint-ignore prefer-const
	let constantTable: ConstantTable = [];

	for (let j = 0; j < constantTableSize; j++) {
		constantTable.push({ type: ConstantType.Nil, value: undefined });
	};

	for (let j = 0; j < constantTableSize; j++) {
		const type: ConstantType = reader.readByte(); 

		switch (type) {
			case ConstantType.Nil:
				break;
			case ConstantType.Boolean: 
				constantTable[j] = constantValue(type, reader.readBool());
				break;
			case ConstantType.Number:
				constantTable[j] = constantValue(type, reader.readDouble());
				break;
			case ConstantType.String:
				constantTable[j] = constantValue(type, stringTable.readString());
				break;
			case ConstantType.Import:
				constantTable[j] = constantValue(type, { id: reader.readUInt32() });
				break;
			case ConstantType.Table: {
				const keys = reader.readVarInt();
				const table: ConstantTable = [];
				for (let i = 0; i < keys; i++) {
					const key = reader.readVarInt();
					table.push(constantTable[key]);
				};

				constantTable[j] = constantValue(type, table);
				break;
			}
			case ConstantType.Closure:
				constantTable[j] = constantValue(type, { id: reader.readVarInt() });
				break;
			case ConstantType.Vector:
				constantTable[j] = constantValue(type, [
					reader.readFloat(),
					reader.readFloat(),
					reader.readFloat(),
					reader.readFloat()
				]);
				break;
			default:
				throw new Error("Unimplemented constant type");
		}
	};

	return constantTable;
}