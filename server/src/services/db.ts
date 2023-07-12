import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";
import { pipe } from "@effect/data/Function";
import { QueryDBError, DynamoDB } from "../schema/interfaces/db";

const getAll =
  (self: DynamoDBClient): DynamoDB["getAll"] =>
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
          return response.Items.map((i) => unmarshall(i));
        },
        catch: (e) => new QueryDBError(tableName, e as Error),
      }),
      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const getByKey =
  (self: DynamoDBClient): DynamoDB["getByKey"] =>
  (tableName: string, keyName: string, keyValue: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const params = {
            TableName: tableName,
            Key: {
              [keyName]: { S: keyValue },
            },
          };

          const command = new GetItemCommand(params);
          const response = await self.send(command);

          if (!response.Item) return;
          return unmarshall(response.Item);
        },
        catch: (e) =>
          new QueryDBError(
            `Query table ${tableName} with ${keyName}=${keyValue}`,
            e as Error
          ),
      }),

      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

export const dynamodbLayer = (client: DynamoDBClient) =>
  Layer.succeed(
    DynamoDB,
    DynamoDB.of({
      getAll: getAll(client),
      getByKey: getByKey(client),
    })
  );
