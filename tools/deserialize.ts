import { Module } from "../luau-bc/mod.ts";
import { StreamReader } from "../luau-bc/helpers/stream.ts";

async function main(args: string[]) {
	const [ file ] = args;

	if (!file) return;

	const buf = await Deno.readFile(file);
	const reader = new StreamReader(buf);
	const module = new Module(reader).decode();

	const mainProto = module.prototypes.mainProto;
	const [...code] = mainProto.code;


	for (let i = 0; i < code.length; i++) {
		console.log(i, code[i])
	}
};

await main(Deno.args);