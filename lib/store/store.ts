import { User } from "@prisma/client";
import create from "zustand";
import { Coordinates, kingsCrossCoords } from "../../types/types";

interface State {
  coordinates: Coordinates;
  actions: {
    setCoordinates: (coordinates: Coordinates) => void;
    setIsLoading: (isLoading: boolean) => void;
    setUser: (user: User) => void;
    setCurrentTab: (currentTab: "MAP" | "BROWSE") => void;
    setIsCreatingReview: (isCreatingReview: boolean) => void;
  };
  isLoading: boolean;
  user: User;
  currentTab: "MAP" | "BROWSE";
  isCreatingReview: boolean;
}

const uzeStore = create<State>((set) => ({
  coordinates: {
    lat: kingsCrossCoords.lat,
    lng: kingsCrossCoords.lng,
  },
  isLoading: false,
  user: {} as User,
  currentTab: "MAP",
  isCreatingReview: false,
  actions: {
    setCoordinates: (coordinates) => set({ coordinates }),
    setCurrentTab: (currentTab) => set({ currentTab }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setUser: (user) => set({ user }),
    setIsCreatingReview: (isCreatingReview) => set({ isCreatingReview }),
  },
}));

export default uzeStore;
