import { StreamReader } from "../helpers/stream.ts";
import { Decoder } from "./decoder.ts";

export class Header implements Decoder {
    version: number;
    typeVersion: number;

    constructor(
        private reader: StreamReader
    ) {
        this.version = 0;
        this.typeVersion = 0;
    }

    private decodeVersion() {
        this.version = this.reader.readByte();
    }

    private decodeTypeVersion() {
        if (this.version >= 4) this.typeVersion = this.reader.readByte();
    }

    decode(): Header {
        this.decodeVersion();
        this.decodeTypeVersion();
        
        return this;
    };
}