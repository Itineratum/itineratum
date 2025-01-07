"use client";

import ItineraryPage from "@/components/templates/itinerary-page";
import { APIProvider } from "@vis.gl/react-google-maps";

const Itinerary = ({ params }: { params: { id: string } }) => {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <ItineraryPage params={params} />
    </APIProvider>
  );
};

export default Itinerary;
