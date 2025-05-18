import { trpc } from "@/app/_trpc/client";
import Text from "@/components/atoms/text";
import Alert from "@/components/molecules/alert";
import { AlertType } from "@/constants/enums/alertType";
import { Currency } from "@/constants/enums/currency";
import {
  TypographyTextDecoration,
  TypographyVariant,
} from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import {
  Event,
  Hotel,
  HotelAmenity,
  HotelType,
  Position,
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
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import HotelIcon from "@mui/icons-material/Hotel";
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
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Rating,
  Stack,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import MapMarker from "./review-itinerary/map-section/map-marker";
import { MapMarkerData } from "./review-itinerary/map-section/map-section";

const HotelSelectorDialog = ({
  open,
  setOpen,
  hotels,
  selectedHotels,
  setSelectedHotels,
  destinationIndex,
  destination,
  currency,
  itineraryId,
  events,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  hotels: Hotel[];
  selectedHotels: Hotel[];
  setSelectedHotels: Dispatch<SetStateAction<Hotel[]>>;
  destinationIndex: number;
  destination: string;
  currency: Currency;
  itineraryId: string;
  events: Event[];
}) => {
  const t = useTranslations("itinerary.hotelSelectorDialog");
  const isMobile = useMediaQuery("(max-width:600px)");

  const [hotelTabValue, setHotelTabValue] = useState<number>(0);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>(AlertType.info);
  const [mapMarkersData, setMapMarkersData] = useState<MapMarkerData[]>([]);
  const [hotelMarkerPopupShown, setHotelMarkerPopupShown] =
    useState<boolean>(false);
  const [hotelMarkerRef, hotelMarker] = useAdvancedMarkerRef();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const ratingSpacing = 2;
  const spacing = 4;
  const mobileSpacing = 4;

  const adjustItineraryHotels =
    trpc.itinerary.adjustItineraryHotels.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (hotels) {
      setHotel(hotels[hotelTabValue]);
      setShowAlert(false);
    }
  }, [hotels, hotelTabValue]);

  useEffect(() => {
    if (open && hotels) {
      setHotelTabValue(0);
      setHotel(hotels[0]);
      setShowAlert(false);
      setAlertText("");
      setAlertType(AlertType.info);
    }
  }, [open, destinationIndex, destination, hotels]);

  useEffect(() => {
    if (!events) return;

    const newMapMarkersData: MapMarkerData[] = [];

    for (const event of events) {
      newMapMarkersData.push({
        timeOfDay: event.time_of_day,
        event,
        position: {
          lat: event.coordinates!.lat ?? 0,
          lng: event.coordinates!.lng ?? 0,
        },
      });
    }

    setMapMarkersData(newMapMarkersData);
  }, [events]);

  const handleOnClose = () => {
    if (!isLoading) setOpen(false);
  };

  const hotelSelected = (hotel: Hotel | null) => {
    return selectedHotels.some(
      (selectedHotel: Hotel | null) =>
        selectedHotel &&
        hotel &&
        selectedHotel.name === hotel.name &&
        JSON.stringify(selectedHotel.coordinates) ===
          JSON.stringify(hotel.coordinates),
    );
  };

  const titleHotelTabs = () => {
    const spacing = 2;

    const title = () => {
      return (
        <Text
          text={`${t("selectHotel")} ${destination}`}
          variant={TypographyVariant.h4}
          bold={false}
        />
      );
    };

    const hotelTabs = () => {
      const maxWidth = "1100px";

      const handleOnChange = (
        event: React.SyntheticEvent,
        newValue: number,
      ) => {
        setHotelTabValue(newValue);
      };

      const tabLabels = () => {
        return (
          <Tabs
            value={hotelTabValue}
            onChange={handleOnChange}
            variant="scrollable"
            allowScrollButtonsMobile
            scrollButtons="auto"
          >
            {hotels.map((hotel) => (
              <Tab
                key={JSON.stringify(hotel)}
                label={`${hotel.name} ${hotelSelected(hotel) ? `(${t("selected")})` : ""}`}
                sx={{
                  color: colorsConst.palette.text.primary,
                  width: 1 / hotels.length,
                }}
              />
            ))}
          </Tabs>
        );
      };

      return (
        <Box sx={{ width: "100%", maxWidth, mx: "auto" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {tabLabels()}
          </Box>
        </Box>
      );
    };

    return (
      <DialogTitle>
        <Stack direction="column" spacing={spacing}>
          {title()}
          {hotelTabs()}
        </Stack>
      </DialogTitle>
    );
  };

  const hotelContent = () => {
    const spacing = 4;

    const imageCarousel = () => {
      const carouselHeight = isMobile ? "25vh" : "450px";

      return (
        hotel &&
        hotel.images.length > 0 && (
          <Carousel
            height={carouselHeight}
            animation="fade"
            navButtonsAlwaysVisible={true}
          >
            {hotel!.images.map((image) => (
              <Image
                key={image}
                src={image}
                alt={"Hotel image"}
                layout="fill"
                objectFit="contain"
                loading="lazy"
              />
            ))}
          </Carousel>
        )
      );
    };

    const name = () => {
      return (
        <Text
          text={hotel?.name ?? ""}
          variant={TypographyVariant.h6}
          bold={false}
        />
      );
    };

    const description = () => {
      return (
        hotel?.description && (
          <Text
            text={hotel.description}
            variant={TypographyVariant.body1}
            bold={false}
          />
        )
      );
    };

    const rateClassType = () => {
      const spacing = 1;
      const typographyVariant = TypographyVariant.body1;
      const justifyContent = "center";

      const ratePerNight = () => {
        const label = () => {
          return (
            <Text
              text={t("ratePerNight")}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const value = () => {
          return (
            <Text
              text={`${Currency[currency as unknown as keyof typeof Currency]} ${hotel?.rate_per_night}`}
              variant={typographyVariant}
              bold={false}
            />
          );
        };

        return (
          hotel?.rate_per_night && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      const hotelClass = () => {
        const label = () => {
          return (
            <Text
              text={t("hotelClass")}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const value = () => {
          return (
            <Stack direction="row" spacing={ratingSpacing}>
              <Rating
                precision={0.1}
                value={hotel?.hotel_class ?? 0}
                readOnly
              />
              <Text
                text={
                  hotel?.hotel_class
                    ? `${hotel.hotel_class} ${t("stars")}`
                    : t("na")
                }
                variant={typographyVariant}
                bold={false}
              />
            </Stack>
          );
        };

        return (
          hotel?.hotel_class && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      const type = () => {
        const label = () => {
          return (
            <Text text={t("type")} variant={typographyVariant} bold={true} />
          );
        };

        const value = () => {
          const spacing = 2;
          const hotelType: HotelType =
            HotelType[hotel?.type as keyof typeof HotelType];
          const icon = () =>
            hotelType === HotelType.hotel ? (
              <HotelIcon />
            ) : (
              <HolidayVillageIcon />
            );

          return (
            <Stack direction="row" spacing={spacing}>
              {icon()}
              <Text
                text={`${hotelType}`}
                variant={typographyVariant}
                bold={false}
              />
            </Stack>
          );
        };

        return (
          hotel?.type && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      return (
        <Grid container sx={{ gap: { xs: mobileSpacing, md: 0 } }}>
          {ratePerNight()}
          {hotelClass()}
          {type()}
        </Grid>
      );
    };

    const ratingNumReviewsLocationRating = () => {
      const spacing = 1;
      const typographyVariant = TypographyVariant.body1;
      const justifyContent = "center";

      const rating = () => {
        const label = () => {
          return (
            <Text text={t("rating")} variant={typographyVariant} bold={true} />
          );
        };

        const value = () => {
          return (
            <Stack direction="row" spacing={ratingSpacing}>
              <Rating precision={0.1} value={hotel?.rating ?? 0} readOnly />
              <Text
                text={hotel?.rating ? `${hotel.rating}/5` : t("na")}
                variant={typographyVariant}
                bold={false}
              />
            </Stack>
          );
        };

        return (
          hotel?.rating && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      const numReviews = () => {
        const label = () => {
          return (
            <Text
              text={t("numReviews")}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const value = () => {
          return (
            <Text
              text={`${hotel?.num_reviews}`}
              variant={typographyVariant}
              bold={false}
            />
          );
        };

        return (
          hotel?.num_reviews && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      const locationRating = () => {
        const label = () => {
          return (
            <Text
              text={t("locationRating")}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const value = () => {
          return (
            <Stack direction="row" spacing={ratingSpacing}>
              <Rating
                precision={0.1}
                value={hotel?.location_rating ?? 0}
                readOnly
              />
              <Text
                text={
                  hotel?.location_rating
                    ? `${hotel.location_rating}/5`
                    : t("na")
                }
                variant={typographyVariant}
                bold={false}
              />
            </Stack>
          );
        };

        return (
          hotel?.location_rating && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      return (
        <Grid container sx={{ gap: { xs: mobileSpacing, md: 0 } }}>
          {rating()}
          {numReviews()}
          {locationRating()}
        </Grid>
      );
    };

    const checkInCheckOutTimesWebsite = () => {
      const spacing = 1;
      const typographyVariant = TypographyVariant.body1;
      const justifyContent = "center";

      const checkInTime = () => {
        const label = () => {
          return (
            <Text
              text={t("checkInTime")}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const value = () => {
          return (
            <Text
              text={hotel?.check_in_time ?? ""}
              variant={typographyVariant}
              bold={false}
            />
          );
        };

        return (
          hotel?.check_in_time && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      const checkOutTime = () => {
        const label = () => {
          return (
            <Text
              text={t("checkOutTime")}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const value = () => {
          return (
            <Text
              text={hotel?.check_out_time ?? ""}
              variant={typographyVariant}
              bold={false}
            />
          );
        };

        return (
          hotel?.check_out_time && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      const website = () => {
        const label = () => {
          return (
            <Text text={t("website")} variant={typographyVariant} bold={true} />
          );
        };

        const value = () => {
          return (
            <Text
              text={t("clickHere")}
              variant={typographyVariant}
              bold={false}
              link={hotel?.url}
              textDecoration={TypographyTextDecoration.underline}
            />
          );
        };

        return (
          hotel?.url && (
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {value()}
              </Stack>
            </Grid>
          )
        );
      };

      return (
        <Grid container sx={{ gap: { xs: mobileSpacing, md: 0 } }}>
          {checkInTime()}
          {checkOutTime()}
          {website()}
        </Grid>
      );
    };

    const amenitiesLocation = () => {
      const spacing = 1;
      const typographyVariant = TypographyVariant.body1;
      const justifyContent = "center";
      const amenitiesGrid = 4;
      const locationGrid = 12 - amenitiesGrid;

      const amenities = () => {
        const getIcon = (
          hotelType: HotelType,
          amenity: HotelAmenity | VacationRentalAmenity,
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

        const label = () => {
          return (
            <Text
              text={t("amenities")}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const values = () => {
          const spacing = 2;
          const hotelType: HotelType =
            HotelType[hotel?.type as keyof typeof HotelType];

          return (
            <Stack direction="column" spacing={spacing}>
              {hotel?.amenities.map((amenity: any) => (
                <Stack key={amenity} direction="row" spacing={spacing}>
                  {getIcon(hotelType, amenity)}
                  <Text
                    text={`${amenity}`}
                    variant={typographyVariant}
                    bold={false}
                  />
                </Stack>
              ))}
            </Stack>
          );
        };

        return (
          hotel?.amenities &&
          hotel.amenities.length > 0 && (
            <Grid
              item
              xs={12}
              md={amenitiesGrid}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {values()}
              </Stack>
            </Grid>
          )
        );
      };

      const location = () => {
        const label = () => {
          return (
            <Text
              text={`${t("location")} ${destination}`}
              variant={typographyVariant}
              bold={true}
            />
          );
        };

        const map = () => {
          const height = "400px";
          const width = "700px";
          const borderRadius = "20px";
          const hotelPosition: Position = {
            lat: hotel?.coordinates.latitude ?? 0,
            lng: hotel?.coordinates.longitude ?? 0,
          };

          const eventMapMarker = (mapMarkerData: MapMarkerData) => {
            return (
              <MapMarker
                key={0}
                position={mapMarkerData.position}
                timeOfDay={mapMarkerData.timeOfDay}
                setSelectedEvent={undefined}
                event={mapMarkerData.event}
                selected={null}
              />
            );
          };

          const hotelMapMarker = () => {
            const color = colorsConst.components.mapSection.hotel;

            const handleOnClick = () => {
              setHotelMarkerPopupShown(true);
            };

            const popUp = () => {
              const handleOnClose = () => {
                setHotelMarkerPopupShown(false);
              };

              return (
                hotelMarkerPopupShown && (
                  <InfoWindow anchor={hotelMarker} onClose={handleOnClose}>
                    <Text
                      text={hotel?.name!}
                      variant={TypographyVariant.body1}
                      bold={false}
                    />
                  </InfoWindow>
                )
              );
            };

            return (
              hotel && (
                <AdvancedMarker
                  key={JSON.stringify(hotelPosition)}
                  ref={hotelMarkerRef}
                  position={hotelPosition}
                  onClick={handleOnClick}
                  clickable={true}
                >
                  {popUp()}
                  <Pin
                    background={color}
                    borderColor={color}
                    glyphColor={colorsConst.components.mapSection.glyphColor}
                    scale={2}
                  />
                </AdvancedMarker>
              )
            );
          };

          return (
            hotel?.coordinates && (
              <Box
                sx={{
                  height: { xs: "50vh", md: height },
                  width: { xs: "70vw", md: width },
                }}
              >
                <Map
                  key={JSON.stringify(hotel.coordinates)}
                  mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
                  style={{
                    border: "2px solid black",
                    borderRadius,
                    overflow: "hidden",
                  }}
                  defaultCenter={hotelPosition}
                  defaultZoom={11}
                  gestureHandling={"greedy"}
                  disableDefaultUI={true}
                >
                  {mapMarkersData.map((mapMarkerData: MapMarkerData) =>
                    eventMapMarker(mapMarkerData),
                  )}
                  {hotelMapMarker()}
                </Map>
              </Box>
            )
          );
        };

        return (
          hotel?.coordinates && (
            <Grid
              item
              xs={12}
              md={locationGrid}
              display="flex"
              justifyContent={justifyContent}
            >
              <Stack
                direction="column"
                spacing={spacing}
                display="flex"
                alignItems="center"
              >
                {label()}
                {map()}
              </Stack>
            </Grid>
          )
        );
      };

      return (
        <Grid container sx={{ gap: { xs: 4, md: 0 } }}>
          {amenities()}
          {location()}
        </Grid>
      );
    };

    return (
      <Stack direction="column" spacing={spacing}>
        <Stack direction="column" spacing={spacing}>
          {imageCarousel()}
          <Box>
            {name()}
            {description()}
          </Box>
        </Stack>
        <Stack direction="column" spacing={spacing}>
          {rateClassType()}
          {ratingNumReviewsLocationRating()}
          {checkInCheckOutTimesWebsite()}
          {amenitiesLocation()}
        </Stack>
      </Stack>
    );
  };

  const selectHotelButton = () => {
    const loadingAnimationSize: number = 24;

    const handleOnClick = async () => {
      if (hotel) {
        const newSelectedHotels = [...selectedHotels];
        newSelectedHotels[destinationIndex] = hotel;
        setSelectedHotels(newSelectedHotels);
        const data = {
          itineraryId,
          selectedHotels: newSelectedHotels ?? [],
        };
        setIsLoading(true);
        await adjustItineraryHotels.mutateAsync(data);
        setAlertText(`${t("hotelSelected")} ${destination}`);
        setAlertType(AlertType.success);
        setIsLoading(false);
        utils.itinerary.getItinerary.invalidate();
      } else {
        setAlertText(t("selectedFailed"));
        setAlertType(AlertType.error);
      }

      setShowAlert(true);
    };

    return (
      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={handleOnClick}
          variant="contained"
          disabled={hotelSelected(hotel!) || isLoading}
        >
          {isLoading ? (
            <Stack direction="row" spacing={spacing - 2}>
              <CircularProgress size={loadingAnimationSize} />
              <Text
                text={t("selecting")}
                variant={TypographyVariant.button}
                bold={true}
              />
            </Stack>
          ) : (
            <Text
              text={hotelSelected(hotel!) ? t("alreadySelected") : t("select")}
              variant={TypographyVariant.button}
              bold={true}
            />
          )}
        </Button>
      </Box>
    );
  };

  return (
    hotels && (
      <Dialog
        key={destinationIndex}
        open={open}
        fullScreen={false}
        onClose={handleOnClose}
        maxWidth="lg"
        sx={{ overflow: "scroll" }}
      >
        {titleHotelTabs()}
        <DialogContent>
          <Stack key={destinationIndex} direction="column" spacing={spacing}>
            {hotelContent()}
            {selectHotelButton()}
            <Alert
              showAlert={showAlert}
              setShowAlert={setShowAlert}
              alertText={alertText}
              alertType={alertType}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    )
  );
};

export default HotelSelectorDialog;
