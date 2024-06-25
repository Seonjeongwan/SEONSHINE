import { AllRestaurantType } from '@/types/user';

export type AssignTableType = {
  assigned_date: { id: number; date: string };
  restaurants: AllRestaurantType[];
  address: string;
  selectedRestaurantId?: string;
};

export type SelectionsType = Record<number, { userId: string; address: string }>;
