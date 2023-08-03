import * as Effect from "@effect/io/Effect";
import * as Context from "@effect/data/Context";

import { QueryDBError } from "src/schema/errors";
import { NativeScalarAttributeValue } from "@aws-sdk/util-dynamodb";

export interface DynamoDB {
  getAll: (
    tableName: string
  ) => Effect.Effect<never, QueryDBError, Record<string, any>[] | undefined>;

  getByKey: (
    tableName: string,
    keyName: string,
    keyValue: string
  ) => Effect.Effect<never, QueryDBError, Record<string, any> | undefined>;

  getByKeys: (
    tableName: string,
    keyName: string,
    keyValues: string[]
  ) => Effect.Effect<never, QueryDBError, Record<string, any>[] | undefined>;

  putItem: (
    tableName: string,
    data: { [key: string]: NativeScalarAttributeValue | string[] }
  ) => Effect.Effect<never, QueryDBError, Record<string, any> | undefined>;
}

export const DynamoDB = Context.Tag<DynamoDB>();
