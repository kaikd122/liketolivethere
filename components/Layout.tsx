import { ReactNode, useContext, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import generateUsername from "../lib/util/generate-username";
import { updateUserArgs, updateUserCommand } from "../lib/actions/user";
import uzeStore from "../lib/store/store";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import Modal from "./ui/Modal";
import ReviewCardModal from "./ReviewCardModal";
import Link from "next/link";
import PrizeModal from "./PrizeModal";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
import { MapContext } from "../lib/context/MapContext";
import { Review } from "@prisma/client";
import { getReviewsWithinMapBoundsRequest } from "../lib/actions/review";
import { reviewsToFeatures } from "../lib/util/review-utils";
import MapContainer from "./Map";
import { Geocoder } from "./Geocoder";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import ZoomControl from "./ZoomControl";
import ReviewMarkers from "./ReviewMarkers";

export interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const ctx = useContext(MapContext);
  const mapContainer = useRef(null);
  const executeScroll = () => {
    //@ts-ignore
    mapRef?.current && mapRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const isCreatingReview = uzeStore((state) => state.isCreatingReview);
  const coordinates = uzeStore((state) => state.coordinates);
  const isDragging = uzeStore((state) => state.isDragging);
  const zoom = uzeStore((state) => state.zoom);

  const bounds = uzeStore((state) => state.bounds);
  const {
    setCoordinates,
    setIsMapLoaded,
    setMapViewSearchStatus,
    setIsMapViewUnsearched,
    setBounds,
    setZoom,
    setReviewFeatures,
    setIsCreatingReview,
    setViewOnMapSource,
    setIsDragging,
  } = uzeStore((state) => state.actions);

  useEffect(() => {
    if (!ctx.map) {
      console.log("INITIALIAZING");
      const map = new mapboxgl.Map({
        //@ts-ignore
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12", // stylesheet location
        center: [coordinates.lng, coordinates.lat], // starting position
        zoom: 9, // starting zoom
      });

      map.on("load", async (e) => {
        ctx.setMap(map);
        setIsMapLoaded(true);

        const bounds = map.getBounds().toArray().flat();
        setBounds(bounds);
        setZoom(map.getZoom());

        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          zoom: 16,
          minLength: 3,
          marker: false,
          flyTo: {
            speed: 2,
            zoom: 14,
          },
          countries: "GB",
        });

        geocoder.on("result", () => {
          setIsCreatingReview(false);
          // @ts-ignore
          geocoder?._inputEl?.blur();

          setViewOnMapSource({
            id: "geo-result",
            type: "GEO",
          });
        });

        map.addControl(geocoder);

        setMapViewSearchStatus("LOADING");

        const res = await getReviewsWithinMapBoundsRequest({
          data: {
            bounds: {
              sw: {
                lat: bounds[1],
                lng: bounds[0],
              },
              ne: {
                lat: bounds[3],
                lng: bounds[2],
              },
            },
            coordinates: {
              lat: coordinates.lat,
              lng: coordinates.lng,
            },
          },
        });

        setMapViewSearchStatus("SEARCHED");

        const data: Partial<Review>[] = await res.json();
        setReviewFeatures(reviewsToFeatures(data));
      });

      map.on("click", (e) => {
        if (!isDragging) {
          return;
        }
        const lngLat = e.lngLat;
        setCoordinates({
          lng: lngLat.lng,
          lat: lngLat.lat,
        });
        setIsDragging(false);
      });
      map.on("dragstart", () => {
        if (isCreatingReview) {
          return;
        }
        setIsDragging(true);
      });
      map.on("dragend", (e) => {
        console.log(e);
        setIsDragging(false);

        if (!isCreatingReview) {
          setCoordinates({
            lng: map.getCenter().lng,
            lat: map.getCenter().lat,
          });
        } else {
          setZoom(e.viewState.zoom);
          // setBounds(e.target.getBounds().toArray().flat());
          const map = e.target;
          map.flyTo({
            center: [coordinates.lng, coordinates.lat],
            zoom: zoom,
          });
        }
      });

      map.on("zoomend", (e) => {
        setIsDragging(false);
        if (!isCreatingReview) {
          setCoordinates({
            lng: map.getCenter().lng,
            lat: map.getCenter().lat,
          });
        } else {
          setZoom(e.viewState.zoom);
          setBounds(e.target.getBounds().toArray().flat());
        }
      });

      map.on("zoomstart", () => {
        if (isCreatingReview) {
          return;
        }
        setIsDragging(true);
      });
    }
  }, [ctx.map, ctx.setMap]);

  const user = uzeStore((state) => state.user);
  const { setUser, setCurrentTab } = uzeStore((state) => state.actions);
  const { data: session } = useSession();
  const router = useRouter();
  const currentTab = uzeStore((state) => state.currentTab);
  useEffect(() => {
    console.log(session);
    if (!session || user?.name) {
      return;
    }
    if (session.user?.name) {
      setUser({
        ...user,
        email: session?.user?.email,
        id: session?.user?.id,
        name: session?.user?.name,
      });
      return;
    }

    if (!user?.name) {
      const newName = generateUsername();
      const args: updateUserArgs = {
        userId: session?.user?.id,
        data: { name: newName },
      };
      const updateUser = async () => {
        const res = await updateUserCommand(args);
        const data = await res.json();
        return data;
      };
      const data = updateUser();
      setUser({
        email: session?.user?.email,
        emailVerified: null,
        id: session?.user?.id,
        image: null,
        name: newName,
      });
      return;
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (currentTab !== undefined) {
      return;
    }
    if (router.asPath === "/") {
      setCurrentTab("MAP");
    } else if (router.asPath === "/profile") {
      setCurrentTab("PROFILE");
    } else if (router.asPath.slice(0, 6) === "/towns") {
      setCurrentTab("TOWNS");
    }
  }, [router.asPath]);
  return (
    <div className=" flex flex-col w-full min-h-full ">
      <Toaster
        toastOptions={{
          style: { font: "Outfit" },
        }}
      />
      <Navbar />

      <div
        ref={mapContainer}
        className={`flex flex-col  items-center justify-center h-96 border ${
          isCreatingReview ? "border-petal border-2" : "border-stone-400"
        } max-h-[50vh] md:max-h-[100vh] rounded shadow`}
      >
        <Geocoder />
        <ZoomControl />
        <ReviewMarkers bounds={bounds} zoom={zoom} />
      </div>

      <ReviewCardModal />
      <PrizeModal />

      <main className="flex flex-col md:px-8 mb-8  md:gap-8 min-h-[70vh]">
        {children}
      </main>
      <footer className="flex flex-row gap-8 justify-center items-center h-12 border border-t border-stone-300 text-stone-700 border-r-0 border-l-0 border-b-0 mx-2">
        <p>Copyright © 2022 Like To Live There</p>
        <Link className="text-petal " href={"mailto:admin@liketolivethere.com"}>
          Contact
        </Link>
      </footer>
    </div>
  );
}
