import { SortingState } from '@tanstack/react-table';

export const DummyData = Array.from({ length: 28 }, (v, k) => ({
  _id: (23063240 + k).toString(),
  name: `User ${k + 1}`,
  age: 20 + (k % 10),
  job: `Job ${k + 1}`,
  country: `Country ${k + 1}`,
  status: k % 2 === 0 ? 'Active' : 'Inactive',
}));

export const fetchUserData = async (page: number, limit: number, sorting: SortingState) => {
  console.log({ sorting });
  const start = (page - 1) * limit;
  const end = start + limit;
  const items = DummyData.slice(start, end);
  const total = DummyData.length;

  return {
    items,
    total,
  };
};
