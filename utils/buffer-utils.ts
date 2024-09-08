import { TypedArray } from "../types/TypedArray.ts";

// written by chatgpt :sob:
export function concat<T extends TypedArray>(...arrays: T[]): T {
    // Calculate total length of concatenated arrays
    const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);

    // Create a new array of the same type and correct length
    const concatenated = new (arrays[0].constructor as new (length: number) => T)(totalLength);

    // Copy each array into the new concatenated array
    let offset = 0;
    for (const arr of arrays) {
        concatenated.set(arr, offset);
        offset += arr.length;
    }

    return concatenated;
};

export function fill(length: number, padding: number): Uint8Array {
    const arr = new Uint8Array(length);
   
    for (let i = 0; i < length; i++) {
        arr[i] = padding;
    };

    return arr;
};