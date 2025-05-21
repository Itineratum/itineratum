import Text from "@/components/atoms/text";
import { Currency } from "@/constants/enums/currency";
import { TypographyVariant } from "@/constants/enums/theme";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Button } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { DaySpendingsBreakdown, EventSpending } from "./spendings-breakdown";

const DaySpendingsBreakdownItem = ({
  daySpendingsBreakdown,
}: {
  daySpendingsBreakdown: DaySpendingsBreakdown;
}) => {
  const { selectedItinerary } = useSavedTrips();
  const currency =
    selectedItinerary?.request.payload.localisation.currency ?? "sgd";

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleOnClick = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="start">
      <Button
        variant="contained"
        sx={{
          my: 2,
          backgroundColor: "white",
          color: "black",
          borderRadius: "20px",
          border: "1px black solid",
          display: "flex",
          flexDirection: "row",
        }}
        onClick={handleOnClick}
      >
        <Box marginRight={2}>
          {isVisible ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        </Box>
        <Text
          text={dayjs(daySpendingsBreakdown.date).format("D MMM YYYY")}
          variant={TypographyVariant.h6}
          bold={false}
        />
      </Button>
      {isVisible &&
        daySpendingsBreakdown.spendingsBreakdown.map(
          (eventSpending: EventSpending, index) => (
            <Box sx={{ margin: 1 }}>
              <Text
                text={`${index + 1}) ${eventSpending.name}: ${Currency[currency]}${eventSpending.price}`}
                variant={TypographyVariant.body1}
                bold={false}
              />
            </Box>
          )
        )}
    </Box>
  );
};

export default DaySpendingsBreakdownItem;
