import * as z from "zod";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";

import { pipe } from "@effect/data/Function";
import { BookingService } from "./interfaces/booking";
import { DynamoDB } from "./interfaces/db";
import { BookingSchema, MealType } from "src/schema/schemas";
import { ObjectNotExistsInDBError, ParseError } from "src/schema/errors";

const tableName = `momcare-server-dev-booking`;

const getAllBookings =
  (self: DynamoDB): BookingService["getAllBookings"] =>
  () =>
    pipe(
      self.getAll(tableName),
      Effect.flatMap((data) => {
        const bookings = z.array(BookingSchema).safeParse(data);

        if (bookings.success) {
          console.log("transformed data", bookings.data);
          return Effect.succeed(bookings.data);
        }

        return Effect.fail(new ParseError(JSON.stringify(data), bookings.error.message))
      }),
      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const getBookingById =
  (self: DynamoDB): BookingService["getBookingById"] =>
  (id: string) =>
    pipe(
      self.getByKey(tableName, "id", id),
      Effect.flatMap((data) => {
        if (!data) {
          return Effect.succeed(undefined);
        }

        const booking = BookingSchema.safeParse(data);

        if (booking.success) {
          console.log("transformed data", booking.data);
          return Effect.succeed(booking.data)
        } else {
          return Effect.fail(new ParseError(JSON.stringify(data), booking.error.message))
        }
      }),
      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const createBooking =
  (self: DynamoDB): BookingService["createBooking"] =>
  ({ date, meal, dishes }: { date: Date; meal: MealType; dishes: string[] }) =>
    pipe(
      self.putItem(tableName, {
        id: `${date.toISOString()}_${meal}`,
        date: date.toISOString(),
        meal: meal,
        dishes: dishes,
      }),
      Effect.flatMap((data) => {
        const booking = BookingSchema.safeParse({
          ...data,
          date: date,
        });
        if (booking.success) {
          console.log("transformed data", booking.data);
          return Effect.succeed(booking.data);
        } else {
          console.log("parse error", booking.error.format());
          return Effect.fail(new ParseError(JSON.stringify(data), booking.error.message))
        }
      }),
      Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
    );

const updateBooking =
  (self: DynamoDB): BookingService["updateBooking"] =>
  ({
    id,
    date,
    meal,
    dishes,
  }: {
    id: string;
    date: Date;
    meal: MealType;
    dishes: string[];
  }) =>
    Effect.gen(function* (_) {
      const booking = yield* _(self.getByKey(tableName, "id", id));

      if (!booking) {
        return yield* _(
          Effect.fail(new ObjectNotExistsInDBError(tableName, id))
        );
      }

      return yield* _(
        pipe(
          self.putItem(tableName, {
            id,
            date: date.toISOString(),
            meal: meal,
            dishes: dishes,
          }),
          Effect.flatMap((data) => {
            const booking = BookingSchema.safeParse({
              ...data,
              date: date,
            });
            if (booking.success) {
              console.log("transformed data", booking.data);
              return Effect.succeed(booking.data);
            } else {
              console.log("parse error", booking.error.format());
              return Effect.fail(
                new ParseError(JSON.stringify(data), booking.error.message)
              );
            }
          }),
          Effect.tapError((e) => Effect.sync(() => console.log("Error", e)))
        )
      );
    });

export const bookingLayer = Layer.effect(
  BookingService,
  Effect.map(DynamoDB, (db) =>
    BookingService.of({
      getAllBookings: getAllBookings(db),
      getBookingById: getBookingById(db),
      createBooking: createBooking(db),
      updateBooking: updateBooking(db),
    })
  )
);
