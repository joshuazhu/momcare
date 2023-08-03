import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";
import { pipe } from "@effect/data/Function";

import { DynamoDB } from "./interfaces/db";
import { DishService } from "src/services/interfaces/dish";
import { z } from "zod";
import { DishSchema } from "src/schema/schemas";
import { ObjectNotExistsInDBError, ParseError } from "src/schema/errors";

const tableName = `momcare-server-dev-dish`;

const getAllDishes =
  (self: DynamoDB): DishService["getAllDishes"] =>
  () =>
    pipe(
      self.getAll(tableName),
      Effect.flatMap((data) => {
        const dishes = z.array(DishSchema).safeParse(data);

        if (dishes.success) {
          console.log("transformed data", dishes.data);
          return Effect.succeed(dishes.data);
        }

        return Effect.fail(
          new ParseError(JSON.stringify(data), dishes.error.message)
        );
      }),
      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const getDishesByTitles =
  (self: DynamoDB): DishService["getDishesByTitles"] =>
  (titles: string[]) =>
    pipe(
      self.getByKeys(tableName, "title", titles),
      Effect.flatMap((data) => {
        const dishes = z.array(DishSchema).safeParse(data);

        if (dishes.success) {
          console.log("transformed data", dishes.data);
          return Effect.succeed(dishes.data);
        } else {
          return Effect.fail(
            new ParseError(JSON.stringify(data), dishes.error.message)
          );
        }
      }),

      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const getDishByTitle =
  (self: DynamoDB): DishService["getDishByTitle"] =>
  (title: string) =>
    pipe(
      self.getByKey(tableName, "title", title),
      Effect.flatMap((data) => {
        const dish = DishSchema.safeParse(data);

        if (dish.success) {
          console.log("transformed data", dish.data);
          return Effect.succeed(dish.data);
        } else {
          return Effect.fail(
            new ParseError(JSON.stringify(data), dish.error.message)
          );
        }
      }),

      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const updateDish =
  (self: DynamoDB): DishService["updateDish"] =>
  ({
    title,
    ingredients,
    category,
  }: {
    title: string;
    ingredients: string[];
    category: string;
  }) =>
    Effect.gen(function* (_) {
      const dish = yield* _(self.getByKey(tableName, "title", title));

      if (!dish) {
        return yield* _(
          Effect.fail(new ObjectNotExistsInDBError(tableName, title))
        );
      }

      return yield* _(
        pipe(
          self.putItem(tableName, {
            title,
            ingredients,
            category,
          }),
          Effect.flatMap((data) => {
            const dish = DishSchema.safeParse(data);
            if (dish.success) {
              console.log("transformed data", dish.data);
              return Effect.succeed(dish.data);
            } else {
              console.log("parse error", dish.error.format());
              return Effect.fail(
                new ParseError(JSON.stringify(data), dish.error.message)
              );
            }
          }),
          Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
        )
      );
    });

export const dishLayer = Layer.effect(
  DishService,
  Effect.map(DynamoDB, (db) =>
    DishService.of({
      getAllDishes: getAllDishes(db),
      getDishByTitle: getDishByTitle(db),
      getDishesByTitles: getDishesByTitles(db),
      updateDish: updateDish(db),
    })
  )
);
