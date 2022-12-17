import { User } from "@prisma/client";
import create from "zustand";
import { Coordinates, kingsCrossCoords } from "../../types/types";

type TabOptions = "MAP" | "TOWNS" | "WRITE";

interface State {
  coordinates: Coordinates;
  actions: {
    setCoordinates: (coordinates: Coordinates) => void;
    setIsLoading: (isLoading: boolean) => void;
    setUser: (user: User) => void;
    setCurrentTab: (currentTab: TabOptions) => void;
    setIsCreatingReview: (isCreatingReview: boolean) => void;
    setIsDragging: (isDragging: boolean) => void;
  };
  isLoading: boolean;
  user: User;
  currentTab: TabOptions;
  isCreatingReview: boolean;
  isDragging: boolean;
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
  isDragging: false,
  actions: {
    setCoordinates: (coordinates) => set({ coordinates }),
    setCurrentTab: (currentTab) => set({ currentTab }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setUser: (user) => set({ user }),
    setIsCreatingReview: (isCreatingReview) => set({ isCreatingReview }),
    setIsDragging: (isDragging) => set({ isDragging }),
  },
}));

export default uzeStore;
