import SavedTripsPage from "@/components/templates/saved-trips-page";
import { SavedTripsProvider } from "@/contexts/savedTripsContext";

const SavedTrips = () => {
  return (
    <SavedTripsProvider>
      <SavedTripsPage />
    </SavedTripsProvider>
  );
};

export default SavedTrips;
