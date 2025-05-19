"use client";

import ItineraryPage from "@/components/templates/itinerary-page";
import { useItinerary } from "@/hooks/useItinerary";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const Itinerary = ({ params }: { params: { id: string } }) => {
  const { setParams } = useItinerary();

  useEffect(() => {
    if (params) setParams(params);
  }, [params]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <ItineraryPage />
    </APIProvider>
  );
};

export default Itinerary;
