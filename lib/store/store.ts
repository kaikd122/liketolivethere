import { User } from "@prisma/client";
import create from "zustand";
import {
  Coordinates,
  kingsCrossCoords,
  ReviewFeature,
} from "../../types/types";

type TabOptions = "MAP" | "TOWNS" | "PROFILE" | undefined;

interface State {
  coordinates: Coordinates;
  actions: {
    setCoordinates: (coordinates: Coordinates) => void;
    setIsLoading: (isLoading: boolean) => void;
    setUser: (user: User) => void;
    setCurrentTab: (currentTab: TabOptions) => void;
    setIsCreatingReview: (isCreatingReview: boolean) => void;
    setIsDragging: (isDragging: boolean) => void;
    setIsMapLoaded: (isMapLoaded: boolean) => void;
    setCurrentReviewId: (currentReviewId: string) => void;
    setReviewFeatures: (reviewFeatures: ReviewFeature[]) => void;
  };
  isLoading: boolean;
  user: User;
  currentTab: TabOptions;
  isCreatingReview: boolean;
  isDragging: boolean;
  isMapLoaded: boolean;
  currentReviewId: string;
  reviewFeatures: ReviewFeature[];
}

const uzeStore = create<State>((set) => ({
  coordinates: {
    lat: kingsCrossCoords.lat,
    lng: kingsCrossCoords.lng,
  },
  isLoading: false,
  user: {} as User,
  currentTab: undefined,
  isCreatingReview: false,
  isDragging: false,
  isMapLoaded: false,
  currentReviewId: "",
  reviewFeatures: [],
  actions: {
    setCurrentReviewId: (currentReviewId) => set({ currentReviewId }),
    setCoordinates: (coordinates) => set({ coordinates }),
    setIsMapLoaded: (isMapLoaded) => set({ isMapLoaded }),
    setCurrentTab: (currentTab) => set({ currentTab }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setUser: (user) => set({ user }),
    setIsCreatingReview: (isCreatingReview) => set({ isCreatingReview }),
    setIsDragging: (isDragging) => set({ isDragging }),
    setReviewFeatures: (reviewFeatures) => set({ reviewFeatures }),
  },
}));

export default uzeStore;
