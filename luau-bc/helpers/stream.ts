export class StreamReader {
    view: DataView;
    buffer: Uint8Array;

    public head: number

    constructor(buffer: Uint8Array) {
        this.head = 0;
        this.buffer = buffer;
        this.view = new DataView(buffer.buffer);
    }

    readByte() {
        return this.view.getUint8(this.head++);
    }

    readVarInt() {
        let byte = 0;
        let result = 0;
        let shift = 0;

        do
        {
            byte = this.readByte();
            result |= (byte & 127) << shift;
            shift += 7;
        } while (byte & 128);

        return result;
    }

    readDouble(): number {
        const d = this.view.getFloat64(this.head, true);
        this.advance(8);
        return d;
    };

    readFloat(): number {
        const f = this.view.getFloat32(this.head, true);
        this.advance(4);
        return f;
    };

    readUInt32(): number {
        const f = this.view.getUint32(this.head, true);
        this.advance(4);
        return f;
    };

    readBool(): boolean {
        return this.readByte() == 1
    }

    readBytes(length: number) {
        const bufSlice = this.buffer.slice(this.head, this.head + length);
        this.head += length

        return bufSlice;
    };

    advance(bytes: number) {
        this.head += bytes;
    };

    rewind(bytes: number) {
        this.head -= bytes;
    };
}