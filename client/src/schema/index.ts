export enum Meal {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Supper = "Supper",
}

export interface Booking {
  id?: string | null;
  totalIngredients?: Array<string | null> | null;
  dishes?: Array<string | null> | null;
  meal?: string | null;
  date?: any | null;
}
