export class ParseError extends Error {
  readonly _tag = "ParseError";

  constructor(readonly source: string, readonly errorMessage: string) {
    super(`Parse error happened. Source: ${source}, Error: ${errorMessage}`);
  }
}

export class QueryDBError extends Error {
  readonly _tag = "QueryDBError";

  constructor(readonly tableName: string, readonly errorMessage: string) {
    super(`error querying DB, table: ${tableName}, error: ${errorMessage}`);
  }
}

export class ObjectNotExistsInDBError extends Error {
  readonly _tag = "ObjectNotExistsInDB";

  constructor(readonly tableName: string, readonly id: string) {
    super(`Object not exists, table: ${tableName}, id: ${id}`);
  }
}
