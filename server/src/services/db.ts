import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  BatchGetCommand,
  BatchGetCommandInput
} from "@aws-sdk/lib-dynamodb";
import {
  NativeScalarAttributeValue,
} from "@aws-sdk/util-dynamodb";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";
import { pipe } from "@effect/data/Function";

import { DynamoDB } from "./interfaces/db";
import { QueryDBError } from "src/schema/errors";

const putItem =
  (self: DynamoDBDocumentClient): DynamoDB["putItem"] =>
  (
    tableName: string,
    data: { [key: string]: NativeScalarAttributeValue | string[] }
  ) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const params = {
            TableName: tableName,
            Item: { ...data },
          };

          await self.send(new PutCommand(params));

          return data
        },
        catch: (e) => new QueryDBError(tableName, (e as Error).message),
      }),
      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const getAll =
  (self: DynamoDBDocumentClient): DynamoDB["getAll"] =>
  (tableName: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const params = {
            TableName: tableName,
          };
          const command = new ScanCommand(params);
          const response = await self.send(command);

          if (!response.Items) return [];
          return response.Items
        },
        catch: (e) => new QueryDBError(tableName, (e as Error).message),
      }),
      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const getByKey =
  (self: DynamoDBDocumentClient): DynamoDB["getByKey"] =>
  (tableName: string, keyName: string, keyValue: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const params = {
            TableName: tableName,
            Key: {
              [keyName]: keyValue,
            },
          };

          const command = new GetCommand(params);
          const response = await self.send(command);

          return response.Item
        },
        catch: (e) =>
          new QueryDBError(
            `Query table ${tableName} with ${keyName}=${keyValue}`,
            (e as Error).message
          ),
      }),

      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

  const getByKeys = 
  (self: DynamoDBDocumentClient): DynamoDB["getByKeys"] =>
  (tableName: string, keyName: string, keyValues: string[]) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
            const params = {
              RequestItems: {
                [tableName]: {
                  Keys: keyValues.map(value => ({ [keyName]: value}))
                }
              }
            };

          const command = new BatchGetCommand(params);
          const response = await self.send(command);
          
          return response.Responses ? response.Responses[tableName] : []
        },
        catch: (e) =>
          new QueryDBError(
            `Query table ${tableName} with ${keyName} of ${keyValues}`,
            (e as Error).message
          ),
      }),

      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

export const dynamodbLayer = (client: DynamoDBDocumentClient) =>
  Layer.succeed(
    DynamoDB,
    DynamoDB.of({
      getAll: getAll(client),
      getByKey: getByKey(client),
      putItem: putItem(client),
      getByKeys: getByKeys(client)
    })
  );
