import { Review, User } from "@prisma/client";
import create from "zustand";
import { ReviewWithDistance } from "../../components/TownReviewsList";
import {
  Coordinates,
  kingsCrossCoords,
  ReviewFeature,
} from "../../types/types";

type TabOptions = "MAP" | "TOWNS" | "PROFILE" | undefined;

type MapViewSearchStatus = "UNSEARCHED" | "SEARCHED" | "LOADING";

interface State {
  coordinates: Coordinates;
  reviewStubs: ReviewWithDistance[];
  mapViewSearchStatus: MapViewSearchStatus;
  actions: {
    setReviewStubs: (reviewStubs: ReviewWithDistance[]) => void;
    setCoordinates: (coordinates: Coordinates) => void;
    setIsLoading: (isLoading: boolean) => void;
    setUser: (user: User) => void;
    setCurrentTab: (currentTab: TabOptions) => void;
    setIsCreatingReview: (isCreatingReview: boolean) => void;
    setIsDragging: (isDragging: boolean) => void;
    setIsMapLoaded: (isMapLoaded: boolean) => void;
    setCurrentReviewId: (currentReviewId: string) => void;
    setReviewFeatures: (reviewFeatures: ReviewFeature[]) => void;
    setIsMapViewUnsearched: (isMapViewUnsearched: boolean | undefined) => void;
    setMapViewSearchStatus: (mapViewSearchStatus: MapViewSearchStatus) => void;
    setZoom: (zoom: number) => void;
    setBounds: (bounds: number[]) => void;
    setCurrentTownId: (currentTownId: number | undefined) => void;
    setCurrentTownReviews: (currentTownReviews: Partial<Review>[]) => void;
    setEditReviewId: (editReviewId: string) => void;
    setViewOnMapSource: (
      viewOnMapSource: {
        id: string;
        type: "TOWN" | "REVIEW" | "WRITE" | "GEO";
      } | null
    ) => void;
  };
  isLoading: boolean;
  user: User;
  currentTab: TabOptions;
  isCreatingReview: boolean;
  isDragging: boolean;
  isMapLoaded: boolean;
  currentReviewId: string;
  editReviewId: string;
  reviewFeatures: ReviewFeature[];
  isMapViewUnsearched: boolean | undefined;
  zoom: number;
  bounds: number[];
  currentTownId: number | undefined;
  currentTownReviews: Partial<Review>[];
  viewOnMapSource: {
    id: string;
    type: "TOWN" | "REVIEW" | "WRITE" | "GEO";
  } | null;
}

const uzeStore = create<State>((set) => ({
  coordinates: {
    lat: kingsCrossCoords.lat,
    lng: kingsCrossCoords.lng,
  },
  reviewStubs: [],
  isLoading: false,
  editReviewId: "",
  user: {} as User,
  currentTab: undefined,
  isCreatingReview: false,
  isDragging: false,
  isMapLoaded: false,
  currentReviewId: "",
  reviewFeatures: [],
  isMapViewUnsearched: undefined,
  zoom: 9,
  bounds: [],
  currentTownId: undefined,
  currentTownReviews: [],
  viewOnMapSource: null,
  mapViewSearchStatus: "LOADING",
  actions: {
    setMapViewSearchStatus: (mapViewSearchStatus) =>
      set({ mapViewSearchStatus }),

    setReviewStubs: (reviewStubs) => set({ reviewStubs }),
    setEditReviewId: (editReviewId) => set({ editReviewId }),
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
    setCurrentTownId: (currentTownId) => set({ currentTownId }),
    setCurrentTownReviews: (currentTownReviews) => set({ currentTownReviews }),
    setViewOnMapSource: (viewOnMapSource) => set({ viewOnMapSource }),
  },
}));

export default uzeStore;
