import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Module } from "./mod.ts";
import { StreamReader } from "./helpers/stream.ts";

async function getSample(file: string) {
	const sample = await Deno.readFile(file);
	const reader = new StreamReader(sample);
	const module = new Module(reader).decode();

	return module;
}

describe("Module", () => {
	describe("Basic Module", async () => {
		const module = await getSample("./test-samples/basic.luauc");
	
		describe("MainProto", () => {
			it("Constants", () => {
				const prototypes = module.prototypes;
				const mainProto = prototypes.mainProto;
				const [ firstConstant, secondConstant ] = mainProto.constants;
	
				assertEquals(firstConstant.value, "print");
				assertEquals(secondConstant.value, "Hello world!");
			});
		});
	});


	describe("Branch Module", async () => {
		const module = await getSample("./test-samples/branch.luauc");
		const prototypes = module.prototypes;
		const mainProto = prototypes.mainProto;

		describe("MainProto", () => {
			it("Has 6 operations", () => {
				assertEquals(mainProto.code.length, 6);
			});
		})
	})
})