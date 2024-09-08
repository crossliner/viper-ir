import { StreamReader } from "../helpers/stream.ts";
import { StringTable } from "./string-table.ts"
import { describe, beforeAll, beforeEach, it } from "@std/testing/bdd";
import { assertEquals, assertArrayIncludes } from "@std/assert";

describe("StringTable", () => {
    let reader: StreamReader;
    let bytecodeSample: Uint8Array;
    let stringTable: StringTable;

    beforeAll(async () => {
        bytecodeSample = await Deno.readFile("./test-samples/basic.luauc");
        bytecodeSample = bytecodeSample.slice(2); // remove header
    });

    beforeEach(() => {
        reader = new StreamReader(bytecodeSample);
        stringTable = new StringTable(reader).decode();
    });

    it("getStrings()", () => {
        const strings = stringTable.getStrings();

        assertEquals(strings.length, 2);
        assertArrayIncludes(strings, ["print", "Hello world!"]);
    });
});