import { Operation } from "./opcodes.ts";

export enum OperandType {
	None,
	A,
	AB,
	AC,
	ABC,
	AD,
	D,
	E
};

export function getOparandType(op: Operation): OperandType {
	switch (op) {
		case Operation.LoadNil:
		case Operation.CloseUpvalue:
		case Operation.ForGenericPrepareIndexNext:
		case Operation.LoadConstantAuxiliary:
		case Operation.PrepareVariadicArguments:
		case Operation.ForGenericLoopPrepareNext:
			return OperandType.A

		case Operation.Move:
		case Operation.GetUpvalue:
		case Operation.SetUpvalue:
		case Operation.Return:
		case Operation.Not: 
		case Operation.Minus:
		case Operation.Length:
		case Operation.NewTable:
		case Operation.GetVariadicArguments:
		case Operation.Capture:
			return OperandType.AB

		case Operation.GetGlobal:
		case Operation.SetGlobal:
		case Operation.FastCall:
			return OperandType.AC	

		case Operation.LoadBoolean:
		case Operation.GetTable:
		case Operation.SetTable:
		case Operation.GetTableConstant:
		case Operation.SetTableConstant:
		case Operation.GetTableIndex:
		case Operation.SetTableIndex:
		case Operation.NameCall:
		case Operation.Call:
		case Operation.Add:
		case Operation.Subtract:
		case Operation.Multiply:
		case Operation.Divide:
		case Operation.Modulo:
		case Operation.PowerOf:
		case Operation.AddConstant:
		case Operation.SubtractConstant:
		case Operation.MultiplyConstant:
		case Operation.DivideConstant:
		case Operation.ModuloConstant:
		case Operation.PowerOfConstant:
		case Operation.And:
		case Operation.Or:
		case Operation.AndConstant:
		case Operation.OrConstant:
		case Operation.Concatenate:
		case Operation.SetList:
		case Operation.SubtractRegisterConstant:
		case Operation.DivideRegisterConstant:
		case Operation.FastCall1:
		case Operation.FastCall2:
		case Operation.FastCall2K:
		case Operation.FastCall3:
		case Operation.FloorDivision:
		case Operation.FloorDivisionConstant:
			return OperandType.ABC

		case Operation.LoadNumber:
		case Operation.LoadConstant:
		case Operation.NewClosure:
		case Operation.GetImport:
		case Operation.JumpIf:
		case Operation.JumpIfNot:
		case Operation.JumpIfEqual:
		case Operation.JumpIfLessOrEqual:
		case Operation.JumpIfLess: 
		case Operation.JumpIfNotEqual:
		case Operation.JumpIfNotLessOrEqual:
		case Operation.JumpIfNotLess:
		case Operation.DuplicateTable:
		case Operation.ForNumericPrepare:
		case Operation.ForNumericLoop:
		case Operation.ForGenericLoop:
		case Operation.DuplicateClosure:
		case Operation.ForGenericPrepare:
		case Operation.JumpIfEqualToConstantNil:
		case Operation.JumpIfEqualToConstantBoolean:
		case Operation.JumpIfEqualToConstantNumber:
		case Operation.JumpIfEqualToConstantString:
			return OperandType.AD

		case Operation.JumpX:
		case Operation.Coverage:
			return OperandType.E

		case Operation.Jump:
		case Operation.JumpBack:
			return OperandType.D

		default:
			return OperandType.None
	};
};