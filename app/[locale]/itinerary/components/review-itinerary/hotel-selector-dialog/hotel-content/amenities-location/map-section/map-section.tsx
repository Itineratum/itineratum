import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Position } from "@/lib/pythonBackend/types";
import { Box } from "@mui/material";
import EventMapMarker from "./event-map-marker";
import HotelMapMarker from "./hotel-map-marker";
import { Map } from "@vis.gl/react-google-maps";
import { ITINERARY_STYLES } from "@/app/[locale]/itinerary/components/styles";
import { MapMarkerData } from "../../../../map-section/map-section";

const MapSection = () => {
  const { hotel, mapMarkersData } = useHotelSelector();

  const hotelPosition: Position = {
    lat: hotel?.coordinates.latitude ?? 0,
    lng: hotel?.coordinates.longitude ?? 0,
  };

  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .AMENITIES_LOCATION.MAP;

  return (
    hotel?.coordinates && (
      <Box
        sx={{
          height: { xs: "50vh", md: styles.HEIGHT },
          width: { xs: "70vw", md: styles.WIDTH },
        }}
      >
        <Map
          key={JSON.stringify(hotel.coordinates)}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
          style={{
            border: "2px solid black",
            borderRadius: styles.BORDER_RADIUS,
            overflow: "hidden",
          }}
          defaultCenter={hotelPosition}
          defaultZoom={11}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {mapMarkersData.map((mapMarkerData: MapMarkerData) => (
            <EventMapMarker mapMarkerData={mapMarkerData} />
          ))}
          <HotelMapMarker hotelPosition={hotelPosition} />
        </Map>
      </Box>
    )
  );
};

export default MapSection;
