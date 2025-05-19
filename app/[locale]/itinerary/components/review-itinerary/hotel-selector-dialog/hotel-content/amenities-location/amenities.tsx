import Text from "@/components/atoms/text";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import {
  HotelAmenity,
  HotelType,
  VacationRentalAmenity,
} from "@/lib/pythonBackend/types";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import CribIcon from "@mui/icons-material/Crib";
import DeckIcon from "@mui/icons-material/Deck";
import EvStationIcon from "@mui/icons-material/EvStation";
import FireplaceIcon from "@mui/icons-material/Fireplace";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import HotTubIcon from "@mui/icons-material/HotTub";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import PetsIcon from "@mui/icons-material/Pets";
import PoolIcon from "@mui/icons-material/Pool";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../../../styles";

const Amenities = () => {
  const { hotel } = useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles =
    ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG.HOTEL_CONTENT
      .AMENITIES_LOCATION;

  const hotelType: HotelType = HotelType[hotel?.type as keyof typeof HotelType];

  const getIcon = (
    hotelType: HotelType,
    amenity: HotelAmenity | VacationRentalAmenity
  ) => {
    let icon = null;

    if (hotelType === HotelType.hotel) {
      switch (amenity as HotelAmenity) {
        case HotelAmenity["Free parking"]: {
          icon = <LocalParkingIcon />;
          break;
        }
        case HotelAmenity.Parking: {
          icon = <LocalParkingIcon />;
          break;
        }
        case HotelAmenity["Indoor pool"]: {
          icon = <PoolIcon />;
          break;
        }
        case HotelAmenity["Outdoor pool"]: {
          icon = <PoolIcon />;
          break;
        }
        case HotelAmenity.Pool: {
          icon = <PoolIcon />;
          break;
        }
        case HotelAmenity["Fitness center"]: {
          icon = <FitnessCenterIcon />;
          break;
        }
        case HotelAmenity.Restaurant: {
          icon = <RestaurantIcon />;
          break;
        }
        case HotelAmenity["Free breakfast"]: {
          icon = <FreeBreakfastIcon />;
          break;
        }
        case HotelAmenity.Spa: {
          icon = <HotTubIcon />;
          break;
        }
        case HotelAmenity["Beach access"]: {
          icon = <BeachAccessIcon />;
          break;
        }
        case HotelAmenity["Child-friendly"]: {
          icon = <ChildFriendlyIcon />;
          break;
        }
        case HotelAmenity.Bar: {
          icon = <LocalBarIcon />;
          break;
        }
        case HotelAmenity["Pet-friendly"]: {
          icon = <PetsIcon />;
          break;
        }
        case HotelAmenity["Room service"]: {
          icon = <RoomServiceIcon />;
          break;
        }
        case HotelAmenity["Free Wi-Fi"]: {
          icon = <NetworkWifiIcon />;
          break;
        }
        case HotelAmenity["Air-conditioned"]: {
          icon = <AcUnitIcon />;
          break;
        }
        case HotelAmenity["All-inclusive available"]: {
          icon = <AllInclusiveIcon />;
          break;
        }
        case HotelAmenity["Wheelchair accessible"]: {
          icon = <AccessibleIcon />;
          break;
        }
        case HotelAmenity["EV charger"]: {
          icon = <EvStationIcon />;
          break;
        }
        default: {
          icon = <ThumbUpAltIcon />;
          break;
        }
      }
    } else if (hotelType === HotelType["vacation rental"]) {
      switch (amenity as VacationRentalAmenity) {
        case VacationRentalAmenity["Hot tub"]: {
          icon = <HotTubIcon />;
          break;
        }
        case VacationRentalAmenity["Air-conditioned"]: {
          icon = <AcUnitIcon />;
          break;
        }
        case VacationRentalAmenity["Outdoor grill"]: {
          icon = <OutdoorGrillIcon />;
          break;
        }
        case VacationRentalAmenity.Fireplace: {
          icon = <FireplaceIcon />;
          break;
        }
        case VacationRentalAmenity["Patio or deck"]: {
          icon = <DeckIcon />;
          break;
        }
        case VacationRentalAmenity.Kitchen: {
          icon = <KitchenIcon />;
          break;
        }
        case VacationRentalAmenity["Fitness centre"]: {
          icon = <FitnessCenterIcon />;
          break;
        }
        case VacationRentalAmenity.Cot: {
          icon = <CribIcon />;
          break;
        }
        case VacationRentalAmenity["Beach access"]: {
          icon = <BeachAccessIcon />;
          break;
        }
        case VacationRentalAmenity["Child-friendly"]: {
          icon = <ChildFriendlyIcon />;
          break;
        }
        case VacationRentalAmenity["Pet-friendly"]: {
          icon = <PetsIcon />;
          break;
        }
        case VacationRentalAmenity["Free Wi-Fi"]: {
          icon = <NetworkWifiIcon />;
          break;
        }
        case VacationRentalAmenity.Pool: {
          icon = <PoolIcon />;
          break;
        }
        default: {
          icon = <ThumbUpAltIcon />;
          break;
        }
      }
    } else {
      icon = <ThumbUpAltIcon />;
    }

    return icon;
  };

  return (
    hotel?.amenities &&
    hotel.amenities.length > 0 && (
      <Grid
        item
        xs={12}
        md={styles.AMENITIES_GRID}
        display="flex"
        justifyContent={styles.JUSTIFY_CONTENT}
      >
        <Stack
          direction="column"
          spacing={styles.SPACING}
          display="flex"
          alignItems="center"
        >
          {/* label */}
          <Text
            text={t("amenities")}
            variant={styles.TYPOGRAPHY_VARIANT}
            bold={true}
          />
          {/* values */}
          <Stack direction="column" spacing={styles.VALUES_SPACING}>
            {hotel?.amenities.map((amenity: any) => (
              <Stack
                key={amenity}
                direction="row"
                spacing={styles.VALUES_SPACING}
              >
                {getIcon(hotelType, amenity)}
                <Text
                  text={`${amenity}`}
                  variant={styles.TYPOGRAPHY_VARIANT}
                  bold={false}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Grid>
    )
  );
};

export default Amenities;
