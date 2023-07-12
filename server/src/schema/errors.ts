export class ParseError extends Error {
    readonly _tag = "ParseError";
  
    constructor(readonly errorMessage: string) {
      super(`Parse error happened. Error: ${errorMessage}`);
    }
  }

