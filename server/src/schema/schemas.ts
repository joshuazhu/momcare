import z from "zod";

const Meal = z.enum(["Breakfast", "Lunch", "Dinner", "Supper"])

export const DishSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()).optional().nullable(),
  category: z.string()
});

export const BookingSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  meal: Meal,
  dishes: z.array(z.string())
})

export const CreateBookingInputSchema = z.object({
  date: z.coerce.date(),
  meal: z.enum(["Breakfast", "Lunch", "Dinner", "Supper"]),
  dishes: z.array(z.string()),
});

export const UpdateBookingInputSchema = BookingSchema
export const UpdateDishSchema = DishSchema

export type DishType = z.infer<typeof DishSchema>;
export type MealType = z.infer<typeof Meal>
export type BookingType = z.infer<typeof BookingSchema>