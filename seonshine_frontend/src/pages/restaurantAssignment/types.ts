import { AllRestaurantType } from '@/types/user';

export type AssignTableType = {
  assignedDate: number;
  restaurants: AllRestaurantType[];
  address: string;
  selectedRestaurantId?: string;
};

export type SelectionsType = Record<number, { userId: string; address: string }>;
