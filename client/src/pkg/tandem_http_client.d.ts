/* tslint:disable */
/* eslint-disable */
/**
* Computes the specified program using Multi-Party Computation, keeping the input private.
*
* A Tandem server must be running at the specified url, to provide the contributor's input.
*
* The client can send plaintext metadata to the server, to influence the server's choice of the
* input.
* @param {string} url
* @param {string} plaintext_metadata
* @param {MpcProgram} program
* @param {MpcData} input
* @returns {Promise<MpcData>}
*/
export function compute(url: string, plaintext_metadata: string, program: MpcProgram, input: MpcData): Promise<MpcData>;
/**
* Stores data (either inputs or output) in an Tandem-compatible format.
*/
export class MpcData {
  free(): void;
/**
* Parses and type-checks a Garble string literal as MpcData.
* @param {MpcProgram} program
* @param {string} input
* @returns {MpcData}
*/
  static from_string(program: MpcProgram, input: string): MpcData;
/**
* Parses and type-checks a Garble literal in its JSON representation as MpcData.
* @param {MpcProgram} program
* @param {any} literal
* @returns {MpcData}
*/
  static from_object(program: MpcProgram, literal: any): MpcData;
/**
* Returns MpcData as a Garble literal string.
* @returns {string}
*/
  to_literal_string(): string;
/**
* Returns MpcData as a Garble literal in its JSON representation.
* @returns {any}
*/
  to_literal(): any;
}
/**
* An MPC program that was type-checked and can be executed by the Tandem engine.
*/
export class MpcProgram {
  free(): void;
/**
* Type-checks the specified function, returning a compiled program.
* @param {string} source_code
* @param {string} function_name
*/
  constructor(source_code: string, function_name: string);
/**
* Returns the number of gates in the circuit as a formatted string.
*
* E.g. "79k gates (XOR: 44k, NOT: 13k, AND: 21k)"
* @returns {string}
*/
  report_gates(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_mpcprogram_free: (a: number) => void;
  readonly mpcprogram_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly mpcprogram_report_gates: (a: number, b: number) => void;
  readonly __wbg_mpcdata_free: (a: number) => void;
  readonly mpcdata_from_string: (a: number, b: number, c: number, d: number) => void;
  readonly mpcdata_from_object: (a: number, b: number, c: number) => void;
  readonly mpcdata_to_literal_string: (a: number, b: number) => void;
  readonly mpcdata_to_literal: (a: number, b: number) => void;
  readonly compute: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h5cac4d097867b572: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h91eb57d56a6e8ff2: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
