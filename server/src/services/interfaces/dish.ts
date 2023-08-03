import * as Effect from "@effect/io/Effect";
import * as Context from "@effect/data/Context";

import { DishType } from "../../schema/schemas";
import {
  ObjectNotExistsInDBError,
  ParseError,
  QueryDBError,
} from "../../schema/errors";
export interface DishService {
  getAllDishes: () => Effect.Effect<
    never,
    QueryDBError | ParseError,
    DishType[] | undefined
  >;

  getDishByTitle: (
    title: string
  ) => Effect.Effect<never, QueryDBError | ParseError, DishType | undefined>;

  getDishesByTitles: (
    titles: string[]
  ) => Effect.Effect<never, QueryDBError | ParseError, DishType[] | undefined>;

  updateDish: ({
    title,
    ingredients,
    category,
  }: {
    title: string;
    ingredients: string[];
    category: string;
  }) => Effect.Effect<
    never,
    QueryDBError | ParseError | ObjectNotExistsInDBError,
    DishType | undefined
  >;
}

export const DishService = Context.Tag<DishService>();
