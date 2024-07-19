import { AllRestaurantType } from '@/types/user';

export type AssignTableType = {
  assigned_date: number;
  restaurants: AllRestaurantType[];
  address: string;
  selectedRestaurantId?: string;
};

export type SelectionsType = Record<number, { userId: string; address: string }>;
