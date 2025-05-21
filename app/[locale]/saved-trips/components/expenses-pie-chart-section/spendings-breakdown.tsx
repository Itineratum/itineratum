import Text from "@/components/atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import { IItinerary } from "@/constants/types/itinerary";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import { getItinerarySpendingsBreakdown } from "@/lib/pythonBackend/utils";
import { Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DaySpendingsBreakdownItem from "./day-spendings-breakdown-item";

export const SpendingsBreakdown = () => {
  const { selectedItinerary } = useSavedTrips();

  const [
    selectedItinerarySpendingsBreakdown,
    setSelectedItinerarySpendingsBreakdown,
  ] = useState<ItinerarySpendingsBreakdown | null>(null);

  useEffect(() => {
    if (selectedItinerary)
      setSelectedItinerarySpendingsBreakdown(
        getItinerarySpendingsBreakdown(selectedItinerary),
      );
  }, [selectedItinerary]);

  const t = useTranslations("savedTrips.expensesPieChart");

  return (
    <Container sx={{ my: 4 }}>
      <Text
        text={t("spendingsBreakdown")}
        variant={TypographyVariant.h5}
        bold={false}
      />
      {selectedItinerarySpendingsBreakdown &&
        selectedItinerarySpendingsBreakdown.map(
          (daySpendingsBreakdown: DaySpendingsBreakdown) => (
            <DaySpendingsBreakdownItem
              daySpendingsBreakdown={daySpendingsBreakdown}
            />
          ),
        )}
    </Container>
  );
};

export interface EventSpending {
  name: string;
  price: number;
}

export interface DaySpendingsBreakdown {
  date: Date;
  spendingsBreakdown: EventSpending[];
}

export type ItinerarySpendingsBreakdown = DaySpendingsBreakdown[];
