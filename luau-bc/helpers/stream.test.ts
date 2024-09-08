import { StreamReader } from "./stream.ts";
import { describe, beforeAll, it } from "@std/testing/bdd";
import { assertStrictEquals } from "@std/assert";

import { concat, fill } from "../../utils/buffer-utils.ts";

function writeVarInt(value: number) { // luau's bigint thing
    const ss = []

    do
    {
        const flag = (value > 127) ? 1 : 0

        ss.push((value & 127) | (flag) << 7);
        value >>= 7
    } while (value)

    return new Uint8Array(ss);
};

describe("StreamReader", () => {
    let buffer: Uint8Array
    let reader: StreamReader

    beforeAll(() => {
        const testString = new TextEncoder().encode("Test");
        const bytes = new Uint8Array([ 255 ]);
        const varInt = writeVarInt(1337);
        const padding = concat(fill(3, 3), new Uint8Array([ 6 ])) ;

        buffer = concat(testString, bytes, varInt, padding); // "Test" + 0xFF + var int
        reader = new StreamReader(buffer);
    });


    it("readBytes()", () => {
        const buffer = reader.readBytes(4);
        const str = new TextDecoder().decode(buffer);

        assertStrictEquals(str, "Test");
    });

    it("readByte()", () => {
        assertStrictEquals(reader.readByte(), 255);
    });

    
    it("readVarInt()", () => {
        assertStrictEquals(reader.readVarInt(), 1337);
    });

    it("advance()", () => {
        reader.advance(3);
        assertStrictEquals(reader.readByte(), 6);
    });

    it("rewind()", () => {
        reader.rewind(3);
        assertStrictEquals(reader.readByte(), 3);
    })
});