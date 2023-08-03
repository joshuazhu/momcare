import * as Effect from "@effect/io/Effect";
import * as Context from "@effect/data/Context"

import { BookingType, MealType } from "src/schema/schemas";
import { ObjectNotExistsInDBError, ParseError, QueryDBError } from "src/schema/errors";

export interface BookingService {
    createBooking: ({
        date,
        meal,
        dishes,
      }: {
        date: Date;
        meal: MealType;
        dishes: string[];
      }) => Effect.Effect<never, QueryDBError | ParseError, BookingType | undefined>;

    updateBooking: ({
      id,
      date,
      meal,
      dishes
    }: {
      id: string;
      date: Date;
      meal: MealType;
      dishes: string[];
    }) => Effect.Effect<never, QueryDBError | ParseError | ObjectNotExistsInDBError, BookingType | undefined>;

    getAllBookings: () => Effect.Effect<never, QueryDBError | ParseError, Array<BookingType> | undefined>;
    getBookingById: (id: string) => Effect.Effect<never, QueryDBError | ParseError, BookingType | undefined>;
}

export const BookingService = Context.Tag<BookingService>();