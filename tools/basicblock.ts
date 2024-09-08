import { Module } from "../luau-bc/mod.ts";
import { StreamReader } from "../luau-bc/helpers/stream.ts";
import { splitBasicBlocks } from "../luau-bc/instruction/BasicBlock.ts";

async function main(args: string[]) {
	const [ file ] = args;

	if (!file) return;

	const buf = await Deno.readFile(file);
	const reader = new StreamReader(buf);
	const module = new Module(reader).decode();

	const mainProto = module.prototypes.mainProto;
	const code = mainProto.code;
	
	const blocks = splitBasicBlocks(code);

	for (const [ , block ] of blocks) {
		console.log(block)
	}
};

await main(Deno.args);