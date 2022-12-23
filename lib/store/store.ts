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
    setIsMapViewUnsearched: (isMapViewUnsearched: boolean) => void;
    setZoom: (zoom: number) => void;
    setBounds: (bounds: number[]) => void;
  };
  isLoading: boolean;
  user: User;
  currentTab: TabOptions;
  isCreatingReview: boolean;
  isDragging: boolean;
  isMapLoaded: boolean;
  currentReviewId: string;
  reviewFeatures: ReviewFeature[];
  isMapViewUnsearched: boolean;
  zoom: number;
  bounds: number[];
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
  isMapViewUnsearched: false,
  zoom: 14,
  bounds: [],
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
    setIsMapViewUnsearched: (isMapViewUnsearched) =>
      set({ isMapViewUnsearched }),
    setZoom: (zoom) => set({ zoom }),
    setBounds: (bounds) => set({ bounds }),
  },
}));

export default uzeStore;
