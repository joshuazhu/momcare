import * as z from "zod";
import { ApolloServer } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import * as Layer from "@effect/io/Layer";
import * as Effect from "@effect/io/Effect";

import { DishSchema, MealType } from "./schema/schemas";
import * as db from "./services/db";
import { DynamoDB } from "./schema/interfaces/db";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const mainLive = Layer.mergeAll(
  db.dynamodbLayer(
    new DynamoDBClient({
      region: "ap-southeast-2",
    })
  )
);

const typeDefs = `#graphql
    type Dish {
        title: String
        ingredients: [String]
        category: String
    }

    type Query {
        dishes: [Dish]
        dish(title: String!): Dish
        mealTypes: [String]
    }
`;

const resolvers = {
  Query: {
    dishes: async () => {
      const program = DynamoDB.pipe(
        Effect.flatMap((db) => db.getAll("momcare-server-dev-dish")),
        Effect.flatMap((data) =>
          Effect.sync(() => z.array(DishSchema).parse(data))
        ),
        Effect.tap((data) =>
          Effect.sync(() => console.log("transformed data", data))
        )
      ).pipe(
        Effect.catchAllDefect(() => {
          return Effect.log("Unknown defect caught.", { level: "Fatal" });
        })
      );

      const runnable = Effect.provideLayer(program, mainLive);

      return Effect.runPromise(runnable);
    },
    
    dish: async (
      _parent: any,
      args: { title: string },
      _contextValue: any,
      _info: any
    ) => {
      const program = DynamoDB.pipe(
        Effect.flatMap((db) =>
          db.getByKey("momcare-server-dev-dish", "title", args.title)
        ),
        Effect.flatMap((data) => Effect.sync(() => DishSchema.parse(data))),
        Effect.tap((data) =>
          Effect.sync(() => console.log("transformed data", data))
        )
      ).pipe(
        Effect.catchAllDefect(() => {
          return Effect.log("Unknown defect caught.", { level: "Fatal" });
        })
      );

      const runnable = Effect.provideLayer(program, mainLive);
      return Effect.runPromise(runnable);
    },

    mealTypes: () =>
      ["Breakfast", "Dinner", "Lunch", "Supper"] as Array<MealType>,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

exports.graphqlHandler = server.createHandler();
