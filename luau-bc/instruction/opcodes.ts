export enum Operation
{
    // Nop: noop
    Nop,

    // DebuggerBreak: debugger break
    DebuggerBreak,

    // LoadNil: sets register to nil
    // A: target register
    LoadNil,

    // LoadBoolean: sets register to boolean and jumps to a given short offset (used to compile comparison results into a boolean)
    // A: target register
    // B: value (0/1)
    // C: jump offset
    LoadBoolean,

    // LoadNumber: sets register to a number literal
    // A: target register
    // D: value (-32768..32767)
    LoadNumber,

    // LoadConstant: sets register to an entry from the constant table from the proto (number/vector/string)
    // A: target register
    // D: constant table index (0..32767)
    LoadConstant,

    // Move: move (copy) value from one register to another
    // A: target register
    // B: source register
    Move,

    // GetGlobal: load value from global table using constant string as a key
    // A: target register
    // C: predicted slot index (based on hash)
    // Auxiliary: constant table index
    GetGlobal,

    // SetGlobal: set value in global table using constant string as a key
    // A: source register
    // C: predicted slot index (based on hash)
    // Auxiliary: constant table index
    SetGlobal,

    // GetUpvalue: load upvalue from the upvalue table for the current function
    // A: target register
    // B: upvalue index
    GetUpvalue,

    // SetUpvalue: store value into the upvalue table for the current function
    // A: target register
    // B: upvalue index
    SetUpvalue,

    // CloseUpvalue: close (migrate to heap) all upvalues that were captured for registers >= target
    // A: target register
    CloseUpvalue,

    // GetImport: load imported global table global from the constant table
    // A: target register
    // D: constant table index (0..32767); we assume that imports are loaded into the constant table
    // Auxiliary: 3 10-bit indices of constant strings that, combined, constitute an import path; length of the path is set by the top 2 bits (1,2,3)
    GetImport,

    // GetTable: load value from table into target register using key from register
    // A: target register
    // B: table register
    // C: index register
    GetTable,

    // SetTable: store source register into table using key from register
    // A: source register
    // B: table register
    // C: index register
    SetTable,

    // GetTableConstant: load value from table into target register using constant string as a key
    // A: target register
    // B: table register
    // C: predicted slot index (based on hash)
    // Auxiliary: constant table index
    GetTableConstant,

    // SetTableConstant: store source register into table using constant string as a key
    // A: source register
    // B: table register
    // C: predicted slot index (based on hash)
    // Auxiliary: constant table index
    SetTableConstant,

    // GetTableIndex: load value from table into target register using small integer index as a key
    // A: target register
    // B: table register
    // C: index-1 (index is 1..256)
    GetTableIndex,

    // SetTableIndex: store source register into table using small integer index as a key
    // A: source register
    // B: table register
    // C: index-1 (index is 1..256)
    SetTableIndex,

    // NewClosure: create closure from a child proto; followed by a Capture instruction for each upvalue
    // A: target register
    // D: child proto index (0..32767)
    NewClosure,

    // NameCall: prepare to call specified method by name by loading function from source register using constant index into target register and copying source register into target register + 1
    // A: target register
    // B: source register
    // C: predicted slot index (based on hash)
    // Auxiliary: constant table index
    // Note that this instruction must be followed directly by Call; it prepares the arguments
    // This instruction is roughly equivalent to GetTableKs + Move pair, but we need a special instruction to support custom __namecall metamethod
    NameCall,

    // Call: call specified function
    // A: register where the function object lives, followed by arguments; results are placed starting from the same register
    // B: argument count + 1, or 0 to preserve all arguments up to top (MultiRet)
    // C: result count + 1, or 0 to preserve all values and adjust top (MultiRet)
    Call,

    // Return: returns specified values from the function
    // A: register where the returned values start
    // B: number of returned values + 1, or 0 to return all values up to top (MultiRet)
    Return,

    // Jump: jumps to target offset
    // D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
    Jump,

    // JumpBack: jumps to target offset; this is equivalent to Jump but is used as a safepoint to be able to interrupt while/repeat loops
    // D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
    JumpBack,

    // JumpIf: jumps to target offset if register is not nil/false
    // A: source register
    // D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
    JumpIf,

    // JumpIfNot: jumps to target offset if register is nil/false
    // A: source register
    // D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
    JumpIfNot,

    // JumpIfEqual, JumpIfLessOrEqual, JumpIfLess, JumpIfNotLess, JumpIfNotLessOrEqual, JumpIfNotLess: jumps to target offset if the comparison is true (or false, for Not variants)
    // A: source register 1
    // D: jump offset (-32768..32767; 1 means "next instruction" aka "don't jump")
    // Auxiliary: source register 2
    JumpIfEqual,
    JumpIfLessOrEqual,
    JumpIfLess,
    JumpIfNotEqual,
    JumpIfNotLessOrEqual,
    JumpIfNotLess,

    // Add, Subtract, Muliply, Divide, Modulo, PowerOf: compute arithmetic operation between two source registers and put the result into target register
    // A: target register
    // B: source register 1
    // C: source register 2
    Add,
    Subtract,
    Multiply,
    Divide,
    Modulo,
    PowerOf,

    // AddConstant, SubtractConstant, MultiplyConstant, DivideConstant, ModuloConstant, PowerOfConstant: compute arithmetic operation between the source register and a constant and put the result into target register
    // A: target register
    // B: source register
    // C: constant table index (0..255); must refer to a number
    AddConstant,
    SubtractConstant,
    MultiplyConstant,
    DivideConstant,
    ModuloConstant,
    PowerOfConstant,

    // And, Or: perform `and` or `or` operation (selecting first or second register based on whether the first one is truthy) and put the result into target register
    // A: target register
    // B: source register 1
    // C: source register 2
    And,
    Or,

    // AndConstant, OrConstant: perform `and` or `or` operation (selecting source register or constant based on whether the source register is truthy) and put the result into target register
    // A: target register
    // B: source register
    // C: constant table index (0..255)
    AndConstant,
    OrConstant,

    // Concatenate: concatenate all strings between B and C (inclusive) and put the result into A
    // A: target register
    // B: source register start
    // C: source register end
    Concatenate,

    // Not, Minus, Length: compute unary operation for source register and put the result into target register
    // A: target register
    // B: source register
    Not,
    Minus,
    Length,

    // NewTable: create table in target register
    // A: target register
    // B: table size, stored as 0 for v=0 and ceil(log2(v))+1 for v!=0
    // Auxiliary: array size
    NewTable,

    // DuplicateTable: duplicate table using the constant table template to target register
    // A: target register
    // D: constant table index (0..32767)
    DuplicateTable,

    // SetList: set a list of values to table in target register
    // A: target register
    // B: source register start
    // C: value count + 1, or 0 to use all values up to top (MultiRet)
    // Auxiliary: table index to start from
    SetList,

    // ForNumericPrepare: prepare a numeric for loop, jump over the loop if first iteration doesn't need to run
    // A: target register; numeric for loops assume a register layout [limit, step, index, variable]
    // D: jump offset (-32768..32767)
    // limit/step are immutable, index isn't visible to user code since it's copied into variable
    ForNumericPrepare,

    // ForNumericLoop: adjust loop variables for one iteration, jump back to the loop header if loop needs to continue
    // A: target register; see ForNumericPrepare for register layout
    // D: jump offset (-32768..32767)
    ForNumericLoop,

    // ForGenericLoop: adjust loop variables for one iteration of a generic for loop, jump back to the loop header if loop needs to continue
    // A: target register; generic for loops assume a register layout [generator, state, index, variables...]
    // D: jump offset (-32768..32767)
    // Auxiliary: variable count (1..255) in the low 8 bits, high bit indicates whether to use ipairs-style traversal in the fast path
    // loop variables are adjusted by calling generator(state, index) and expecting it to return a tuple that's copied to the user variables
    // the first variable is then copied into index; generator/state are immutable, index isn't visible to user code
    ForGenericLoop,

    // ForGenericPrepareIndexNext: prepare ForGenericLoop with 2 output variables (no Auxiliary encoding), assuming generator is luaB_inext, and jump to ForGenericLoop
    // A: target register (see ForGenericLoop for register layout)
    ForGenericPrepareIndexNext,

    // FastCall3: perform a fast call of a built-in function using 3 register arguments
    // A: builtin function id (see LuauBuiltinFunction)
    // B: source argument register
    // C: jump offset to get to following Call
    // Auxiliary: source register 2 in least-significant byte
    // Auxiliary: source register 3 in second least-significant byte
    FastCall3,

    // ForGenericLoopPrepareNext: prepare ForGenericLoop with 2 output variables (no Auxiliary encoding), assuming generator is luaB_next, and jump to ForGenericLoop
    // A: target register (see ForGenericLoop for register layout)
    ForGenericLoopPrepareNext,

    // NativeCall: start executing new function in native code
    // this is a pseudo-instruction that is never emitted by bytecode compiler, but can be constructed at runtime to accelerate native code dispatch
    NativeCall,

    // GetVariadicArguments: copy variables into the target register from vararg storage for current function
    // A: target register
    // B: variable count + 1, or 0 to copy all variables and adjust top (MultiRet)
    GetVariadicArguments,

    // DuplicateClosure: create closure from a pre-created function object (reusing it unless environments diverge)
    // A: target register
    // D: constant table index (0..32767)
    DuplicateClosure,

    // PrepareVariadicArguments: prepare stack for variadic functions so that GetVarArgs works correctly
    // A: number of fixed arguments
    PrepareVariadicArguments,

    // LoadConstantAuxiliary: sets register to an entry from the constant table from the proto (number/string)
    // A: target register
    // Auxiliary: constant table index
    LoadConstantAuxiliary,

    // JumpX: jumps to the target offset; like JumpBack, supports interruption
    // E: jump offset (-2^23..2^23; 0 means "next instruction" aka "don't jump")
    JumpX,

    // FastCall: perform a fast call of a built-in function
    // A: builtin function id (see LuauBuiltinFunction)
    // C: jump offset to get to following Call
    // FastCall is followed by one of (GetImport, Move, GetUpval) instructions and by Call instruction
    // This is necessary so that if FastCall can't perform the call inline, it can continue normal execution
    // If FastCall *can* perform the call, it jumps over the instructions *and* over the next Call
    // Note that FastCall will read the actual call arguments, such as argument/result registers and counts, from the Call instruction
    FastCall,

    // Coverage: update coverage information stored in the instruction
    // E: hit count for the instruction (0..2^23-1)
    // The hit count is incremented by VM every time the instruction is executed, and saturates at 2^23-1
    Coverage,

    // Capture: capture a local or an upvalue as an upvalue into a newly created closure; only valid after NewClosure
    // A: capture type, see LuauCaptureType
    // B: source register (for Val/Ref) or upvalue index (for Upval/UpRef)
    Capture,

    // SubtractRegisterConstant, DivideRegisterConstant: compute arithmetic operation between the constant and a source register and put the result into target register
    // A: target register
    // B: source register
    // C: constant table index (0..255); must refer to a number
    SubtractRegisterConstant,
    DivideRegisterConstant,

    // FastCall1: perform a fast call of a built-in function using 1 register argument
    // A: builtin function id (see LuauBuiltinFunction)
    // B: source argument register
    // C: jump offset to get to following Call
    FastCall1,

    // FastCall2: perform a fast call of a built-in function using 2 register arguments
    // A: builtin function id (see LuauBuiltinFunction)
    // B: source argument register
    // C: jump offset to get to following Call
    // Auxiliary: source register 2 in least-significant byte
    FastCall2,

    // FastCall2K: perform a fast call of a built-in function using 1 register argument and 1 constant argument
    // A: builtin function id (see LuauBuiltinFunction)
    // B: source argument register
    // C: jump offset to get to following Call
    // Auxiliary: constant index
    FastCall2K,

    // ForGenericPrepare: prepare loop variables for a generic for loop, jump to the loop backedge unconditionally
    // A: target register; generic for loops assume a register layout [generator, state, index, variables...]
    // D: jump offset (-32768..32767)
    ForGenericPrepare,

    // JumpIfEqualToConstantNil: jumps to target offset if the comparison with constant is true (or false, see Auxiliary)
    // A: source register 1
    // D: jump offset (-32768..32767; 1 means "next instruction" aka "don't jump")
    // Auxiliary: constant value (for boolean) in low bit, Not flag (that flips comparison result) in high bit
    JumpIfEqualToConstantNil,
    JumpIfEqualToConstantBoolean,

    // JumpIfEqualToConstantNumber, JumpIfEqualToConstantString: jumps to target offset if the comparison with constant is true (or false, see Auxiliary)
    // A: source register 1
    // D: jump offset (-32768..32767; 1 means "next instruction" aka "don't jump")
    // Auxiliary: constant table index in low 24 bits, Not flag (that flips comparison result) in high bit
    JumpIfEqualToConstantNumber,
    JumpIfEqualToConstantString,

    // FloorDivision: compute floor division between two source registers and put the result into target register
    // A: target register
    // B: source register 1
    // C: source register 2
    FloorDivision,

    // FloorDivisionConstant: compute floor division between the source register and a constant and put the result into target register
    // A: target register
    // B: source register
    // C: constant table index (0..255)
    FloorDivisionConstant,
    NopAuxiliary
};

export function hasAuxiliary(op: Operation): boolean {
    switch (op) {
        case Operation.GetGlobal:
        case Operation.SetGlobal:
        case Operation.GetImport:
        case Operation.GetTableConstant:
        case Operation.SetTableConstant:
        case Operation.NameCall:
        case Operation.JumpIfEqual:
        case Operation.JumpIfLessOrEqual:
        case Operation.JumpIfLess:
        case Operation.JumpIfNotEqual:
        case Operation.JumpIfNotLessOrEqual:
        case Operation.JumpIfNotLess:
        case Operation.NewTable:
        case Operation.SetList:
        case Operation.ForGenericLoop:
        case Operation.LoadConstantAuxiliary:
        case Operation.FastCall2:
        case Operation.FastCall2K:
        case Operation.FastCall:
        case Operation.FastCall3:
        case Operation.JumpIfEqualToConstantNil:
        case Operation.JumpIfEqualToConstantBoolean:
        case Operation.JumpIfEqualToConstantNumber:
        case Operation.JumpIfEqualToConstantString:
            return true;

        default:
            return false;
    };
}