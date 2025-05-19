import colorsConst from "@/constants/pages/colors.json";
import { useHotelSelector } from "@/hooks/useHotelSelector";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { ITINERARY_STYLES } from "../../styles";

const HotelTabs = () => {
  const { setHotelTabValue, hotelTabValue, hotelSelected, hotels } =
    useHotelSelector();

  const t = useTranslations("itinerary.hotelSelectorDialog");
  const styles = ITINERARY_STYLES.REVIEW_ITINERARY.HOTEL_SELECTOR_DIALOG;

  const handleOnChange = (event: React.SyntheticEvent, newValue: number) => {
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
    <Box
      sx={{ width: "100%", maxWidth: styles.HOTEL_TABS_MAX_WIDTH, mx: "auto" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>{tabLabels()}</Box>
    </Box>
  );
};

export default HotelTabs;
