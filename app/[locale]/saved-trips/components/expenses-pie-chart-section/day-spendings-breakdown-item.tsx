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
import CircleIcon from "@mui/icons-material/Circle";
import { SpendingCategory } from "@/constants/enums/spendingCategory";
import colorsConst from "@/constants/pages/colors.json";

const DaySpendingsBreakdownItem = ({
  daySpendingsBreakdown,
}: {
  daySpendingsBreakdown: DaySpendingsBreakdown;
}) => {
  const { selectedItinerary } = useSavedTrips();
  const currency =
    selectedItinerary?.request.payload.localisation.currency ?? "sgd";

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const colors = colorsConst.expensesPieChart;

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
          alignItems: "center",
        }}
        onClick={handleOnClick}
      >
        <Box marginRight={2} display={"flex"} justifyContent={"cneter"}>
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
            <Box
              sx={{
                margin: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircleIcon
                sx={{
                  color:
                    eventSpending.spendingCategory ===
                    SpendingCategory.accommodation
                      ? colors.accommodationColor
                      : eventSpending.spendingCategory ===
                          SpendingCategory.attraction
                        ? colors.attractionColor
                        : eventSpending.spendingCategory ===
                            SpendingCategory.food
                          ? colors.foodColor
                          : eventSpending.spendingCategory ===
                              SpendingCategory.general
                            ? colors.generalColor
                            : eventSpending.spendingCategory ===
                                SpendingCategory.transport
                              ? colors.transportColor
                              : "white",
                }}
              />
              <Text
                text={`${index + 1}) ${eventSpending.name}: ${Currency[currency]}${eventSpending.price} [${eventSpending.spendingCategory}]`}
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
