import * as Effect from "@effect/io/Effect";
import * as Context from "@effect/data/Context";

export class QueryDBError extends Error {
  readonly _tag = "QueryDBError";

  constructor(readonly tableName: string, readonly error: Error) {
    super(`error querying DB, table: ${tableName}, error: ${error.message}`);
  }
}

export interface DynamoDB {
  getAll: (
    tableName: string
  ) => Effect.Effect<never, QueryDBError, Record<string, any>[] | undefined>;

  getByKey: (
    tableName: string,
    keyName: string,
    keyValue: string
  ) => Effect.Effect<never, QueryDBError, Record<string, any> | undefined>;
}

export const DynamoDB = Context.Tag<DynamoDB>();
