import MapMarker from "../../../../map-section/map-marker";
import { MapMarkerData } from "../../../../map-section/map-section";

const EventMapMarker = ({
  mapMarkerData,
}: {
  mapMarkerData: MapMarkerData;
}) => {
  return (
    <MapMarker
      key={0}
      position={mapMarkerData.position}
      timeOfDay={mapMarkerData.timeOfDay}
      event={mapMarkerData.event}
      selected={null}
    />
  );
};

export default EventMapMarker;
