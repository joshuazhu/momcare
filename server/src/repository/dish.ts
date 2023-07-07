import z from "zod";
import { getAll } from './db'

export const DishSchema = z.object({
    title: z.string(),
    cost: z.number(),
    photos: z.array(z.string()),
    spicyLevel: z.number(),
    whoLovesIt: z.array(z.string())
})

export type DishType = z.infer<typeof DishSchema>;

export const getAllDishes =  async (): Promise<DishType[]> => {
    const data = await getAll('home-meal-server-dev-dish')
    const dishes = z.array(DishSchema).parse(data);
    console.log('!!dishes', dishes)
    return dishes
}