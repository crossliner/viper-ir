import { StreamReader } from "../helpers/stream.ts";
import { StringTable } from "./string-table.ts";

export class ReaderHandle { 
    constructor(
        private stringTable: StringTable,
        private reader: StreamReader
    ) {};

    getStringTable() {
        return this.stringTable;
    };

    getReader() {
        return this.reader;
    };
}