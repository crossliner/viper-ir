import { Header } from "./components/header.ts";
import { ReaderHandle } from "./components/handle.ts";
import { StreamReader } from "./helpers/stream.ts";
import { Prototypes } from "./components/prototype.ts";
import { StringTable } from "./components/string-table.ts";

export enum Version {
	Minimum = 3,
	Maximum = 6
};

export class Module {
	public stringTable: StringTable;
	public prototypes: Prototypes;
	private handle: ReaderHandle;

	constructor(public reader: StreamReader) {
		this.stringTable = new StringTable(reader)
		this.handle = new ReaderHandle(this.stringTable, reader);
		this.prototypes = new Prototypes(this.handle);
	};

	private decodeTypeRemapping(typeVersion: number) {
		if (typeVersion !== 3) return;
		
		const reader = this.handle.getReader();
		let index = reader.readByte();

		while (index !== 0) {
			reader.readVarInt();
			index = reader.readByte();
		}
	}

	decode(): Module {
		const header = new Header(this.reader).decode();
		
		if (!(header.version >= Version.Minimum) && !(header.version <= Version.Maximum))
			throw new Error("Incompatible Version");

		this.stringTable.decode();
		this.decodeTypeRemapping(header.typeVersion);
		this.prototypes.decode();

		return this;
	}
}