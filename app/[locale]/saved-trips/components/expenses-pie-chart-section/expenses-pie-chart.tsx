import { Currency } from "@/constants/enums/currency";
import { SpendingCategory } from "@/constants/enums/spendingCategory";
import colorsConst from "@/constants/pages/colors.json";
import { IItinerary } from "@/constants/types/itinerary";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { DayPlan, Event } from "@/lib/pythonBackend/types";
import { addMockSpendingsData } from "@/lib/pythonBackend/utils";
import { DefaultizedPieValueType, PieValueType } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import { MakeOptional } from "@mui/x-date-pickers/internals";
import { useEffect, useState } from "react";
import { SAVED_TRIPS_STYLES } from "../styles";

const ExpensesPieChart = () => {
  const { selectedItinerary } = useSavedTrips();
  const currency =
    selectedItinerary?.request.payload.localisation.currency ?? "sgd";

  const styles = SAVED_TRIPS_STYLES.EXPENSES_PIE_CHART_SECTION;
  const colors = colorsConst.expensesPieChart;

  const defaultSpendingsBreakdown = [
    {
      id: SpendingCategory.transport,
      value: 0,
      label: SpendingCategory.transport,
      color: colors.transportColor,
    },
    {
      id: SpendingCategory.attraction,
      value: 0,
      label: SpendingCategory.attraction,
      color: colors.attractionColor,
    },
    {
      id: SpendingCategory.food,
      value: 0,
      label: SpendingCategory.food,
      color: colors.foodColor,
    },
    {
      id: SpendingCategory.accommodation,
      value: 0,
      label: SpendingCategory.accommodation,
      color: colors.accommodationColor,
    },

    {
      id: SpendingCategory.general,
      value: 0,
      label: SpendingCategory.general,
      color: colors.generalColor,
    },
  ];

  const [spendingsBreakdown, setSpendingsBreakdown] = useState<
    {
      id: string;
      value: number;
      label: string;
    }[]
  >(defaultSpendingsBreakdown);
  const [totalSpendings, setTotalSpendings] = useState<number>(0);

  // this is for the entire itinerary across all the days
  const getSpendingsBreakdownData = (itinerary: IItinerary) => {
    const data = [...defaultSpendingsBreakdown];

    itinerary.itinerary.forEach((dayPlan: DayPlan) => {
      dayPlan.events.forEach((event: Event) => {
        const dataItemIndex = data.findIndex(
          (item) => item.label === event.spending_category,
        );
        data[dataItemIndex].value += event.price ?? 0;
      });
    });

    return data;
  };

  const getNumOfEventsForSpendingCategory = (
    itinerary: IItinerary,
    category: SpendingCategory,
  ): number => {
    let count = 0;

    itinerary.itinerary.forEach((dayPlan: DayPlan) => {
      dayPlan.events.forEach((event: Event) => {
        if (event.spending_category === category) count += 1;
      });
    });

    return count;
  };

  useEffect(() => {
    if (selectedItinerary) {
      const itineraryWithMockSpending = addMockSpendingsData(selectedItinerary);

      const newSpendingsBreakdown = getSpendingsBreakdownData(
        itineraryWithMockSpending,
      );
      setSpendingsBreakdown(newSpendingsBreakdown);

      setTotalSpendings(
        newSpendingsBreakdown.reduce((sum, item) => sum + item.value, 0),
      );
    }
  }, [selectedItinerary]);

  const arcLabel = (
    item: Omit<DefaultizedPieValueType, "label"> & {
      label?: string;
    },
  ) => {
    const percentage = (item.value / totalSpendings) * 100;
    return percentage > 0
      ? `${Number.isInteger(percentage) ? percentage : percentage.toFixed(2)}%`
      : "";
  };

  const valueFormatter = (v: MakeOptional<PieValueType, "id">) => {
    return (
      selectedItinerary &&
      `${v.label} spending is ${Currency[currency]}${v.value} over ${getNumOfEventsForSpendingCategory(selectedItinerary, v.label as SpendingCategory)} activities.`
    );
  };

  return (
    selectedItinerary && (
      <PieChart
        series={[
          {
            data: spendingsBreakdown,
            highlightScope: { fade: "none", highlight: "item" },
            highlighted: { innerRadius: styles.PIE_CHART_SIZE / 5 },
            arcLabel,
            valueFormatter,
            innerRadius: styles.PIE_CHART_SIZE / 4,
            outerRadius: styles.PIE_CHART_SIZE / 2,
            arcLabelRadius: styles.PIE_CHART_SIZE / 1.5,
            labelMarkType: "square",
          },
        ]}
        width={styles.PIE_CHART_SIZE + styles.PIE_CHART_PADDING}
        height={styles.PIE_CHART_SIZE + styles.PIE_CHART_PADDING}
        slotProps={{
          legend: {
            position: {
              vertical: "bottom",
              horizontal: "start",
            },
            sx: {
              fontSize: 20,
            },
          },
          pieArc: {
            strokeWidth: 0,
          },
          pieArcLabel: {
            fontSize: 20,
          },
        }}
        sx={{
          ".MuiPieArc-highlighted": {
            stroke: "black",
            strokeWidth: 1,
          },
        }}
      />
    )
  );
};

export default ExpensesPieChart;
