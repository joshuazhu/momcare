import z from "zod";

const Meal = z.enum(["Breakfast", "Lunch", "Dinner", "Supper"])

export const DishSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()).optional().nullable(),
  category: z.string()
});

export const OrderSchema = z.object({
  dateAndMeal: z.string(),
  date: z.date(),
  meal: Meal,
  dishes: z.array(z.string()).optional().nullable(),
  totalIngredients: z.array(z.string()).optional().nullable()
})

export type DishType = z.infer<typeof DishSchema>;
export type MealType = z.infer<typeof Meal>
export type OrderType = z.infer<typeof OrderSchema>