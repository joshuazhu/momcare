import { ApolloServer } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import * as Layer from "@effect/io/Layer";
import * as Effect from "@effect/io/Effect";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import * as dateScalar from "./customType/dateScalar";
import {
  CreateBookingInputSchema,
  UpdateBookingInputSchema,
  MealType,
  UpdateDishSchema,
} from "./schema/schemas";
import * as db from "./services/db";
import * as dishService from "./services/dish";
import * as bookingService from "./services/booking";
import { DishService } from "./services/interfaces/dish";
import { BookingService } from "./services/interfaces/booking";
import { ParseError } from "./schema/errors";
import * as Cause from "@effect/io/Cause";

const mainLive = db
  .dynamodbLayer(
    DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: "ap-southeast-2",
      })
    )
  )
  .pipe(
    Layer.provide(
      Layer.merge(dishService.dishLayer, bookingService.bookingLayer)
    )
  );

const typeDefs = `#graphql
    scalar Date

    type Booking {
      id: String
      date: Date
      meal: String
      dishes: [String]
      totalIngredients: [String]
    }
    
    type Dish {
      title: String
      ingredients: [String]
      category: String
    }

    type Query {
      dishes: [Dish]
      dish(title: String!): Dish
      mealTypes: [String]
      bookings: [Booking]
    }

    input CreateBookingInput {
      date: Date 
      meal: String 
      dishes: [String]
    }

    input UpdateBookingInput {
      id: String
      date: Date
      meal: String
      dishes: [String]
    }

    input UpdateDishInput {
      title: String
      ingredients: [String]
      category: String
    }

    type Mutation {
      createBooking(createBookingInput: CreateBookingInput!): Booking!  
      updateBooking(editBookingInput: UpdateBookingInput!): Booking!
      updateDish(updateDishInput: UpdateDishInput!): Dish!
    }
`;

const makeSafeRunEffect = (program: Effect.Effect<any, any, any>) =>
  program.pipe(
    Effect.tapError((e) =>
      Effect.log(`Error happened ${e.message}`, { level: "Error" })
    ),

    Effect.catchAllDefect((defect) => {
      if (Cause.isRuntimeException(defect)) {
        return Effect.log(`RuntimeException defect caught: ${defect.message}`, {
          level: "Error",
        });
      }
      return Effect.log(`Unknown error ${defect}`, { level: "Error" });
    })
  );

const resolvers = {
  Date: dateScalar,
  Booking: {
    totalIngredients: async (parent: { dishes: string[] }) => {
      const { dishes: dishTitles } = parent;

      const program = Effect.gen(function* (_) {
        const dishes = yield* _(
          DishService.pipe(
            Effect.flatMap((s) => s.getDishesByTitles(dishTitles))
          )
        );

        const ingredients = dishes?.reduce(
          (total: string[], current) => [
            ...total,
            ...(current.ingredients || []),
          ],
          []
        );

        return Array.from(new Set(ingredients));
      });

      const runnable = Effect.provideLayer(
        makeSafeRunEffect(program),
        mainLive
      );
      return Effect.runPromise(runnable);
    },
  },

  Query: {
    dishes: async () => {
      const program = DishService.pipe(
        Effect.flatMap((s) => s.getAllDishes()),
        Effect.tap((data) => Effect.sync(() => console.log("Result", data)))
      );

      const runnable = Effect.provideLayer(
        makeSafeRunEffect(program),
        mainLive
      );
      return Effect.runPromise(runnable);
    },

    dish: async (
      _parent: any,
      args: { title: string },
      _contextValue: any,
      _info: any
    ) => {
      const program = DishService.pipe(
        Effect.flatMap((s) => s.getDishByTitle(args.title)),
        Effect.tap((data) => Effect.sync(() => console.log("Result", data)))
      );

      const runnable = Effect.provideLayer(
        makeSafeRunEffect(program),
        mainLive
      );
      return Effect.runPromise(runnable);
    },

    bookings: async () => {
      const program = BookingService.pipe(
        Effect.flatMap((s) => s.getAllBookings()),
        Effect.tap((data) => Effect.sync(() => console.log("Result", data)))
      );

      const runnable = Effect.provideLayer(
        makeSafeRunEffect(program),
        mainLive
      );
      return Effect.runPromise(runnable);
    },

    mealTypes: () =>
      ["Breakfast", "Dinner", "Lunch", "Supper"] as Array<MealType>,
  },

  Mutation: {
    createBooking: async (_parent: any, request: any) => {
      const program = BookingService.pipe(
        Effect.flatMap((s) => {
          const input = CreateBookingInputSchema.safeParse(
            request.createBookingInput
          );

          if (!input.success) {
            return Effect.fail(
              new ParseError(request.createBookingInput, input.error.toString())
            );
          }

          const { date, meal, dishes } = input.data;

          return s.createBooking({
            date,
            meal,
            dishes,
          });
        })
      );

      const runnable = Effect.provideLayer(
        makeSafeRunEffect(program),
        mainLive
      );
      return Effect.runPromise(runnable);
    },
    updateBooking: async (_parent: any, request: any) => {
      const program = BookingService.pipe(
        Effect.flatMap((s) => {
          const input = UpdateBookingInputSchema.safeParse(
            request.editBookingInput
          );

          if (!input.success) {
            return Effect.fail(
              new ParseError(request.editBookingInput, input.error.toString())
            );
          }

          const { id, date, meal, dishes } = input.data;

          return s.updateBooking({
            id,
            date,
            meal,
            dishes: dishes || [],
          });
        })
      );

      const runnable = Effect.provideLayer(
        makeSafeRunEffect(program),
        mainLive
      );
      return Effect.runPromise(runnable);
    },

    updateDish: async (_parent: any, request: any) => {
      const program = DishService.pipe(
        Effect.flatMap((s) => {
          const input = UpdateDishSchema.safeParse(request.updateDishInput);

          if (!input.success) {
            return Effect.fail(
              new ParseError(request.updateDishInput, input.error.toString())
            );
          }

          const { title, ingredients, category } = input.data;

          return s.updateDish({
            title,
            ingredients: ingredients || [],
            category,
          });
        })
      );

      const runnable = Effect.provideLayer(
        makeSafeRunEffect(program),
        mainLive
      );
      return Effect.runPromise(runnable);
    },
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
