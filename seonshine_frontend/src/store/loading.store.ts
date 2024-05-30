import { create } from "zustand";

type LoadingType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useLoadingStore = create<LoadingType>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
