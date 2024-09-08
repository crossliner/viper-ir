import { StreamReader } from "../helpers/stream.ts";
import { Decoder } from "./decoder.ts";

export class StringTable implements Decoder {
    constructor(
        private reader: StreamReader, 
        public strings: string[] = []
    ) {};

    private readStringTable() {
        const stringCount = this.reader.readVarInt();

        for (let i = 0; i < stringCount; i++) {
            const length = this.reader.readVarInt();
            const buf = this.reader.readBytes(length);
            const string = new TextDecoder().decode(buf)

            this.strings.push(string);
        };
    };

    readString() {
        const id = this.reader.readVarInt();
        const str = this.strings[id - 1];

        return str;
    };

    getStrings() {
        return this.strings;
    }

    decode() {
        this.readStringTable();
        return this
    };
}
