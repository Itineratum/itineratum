import colorsConst from "@/constants/pages/colors.json";
import { Container } from "@mui/material";
import ExpensesPieChart from "./expenses-pie-chart";
import ItinerarySelectorDropdown from "./itinerary-selector-dropdown";
import { SpendingsBreakdown } from "./spendings-breakdown";

const ExpensesPieChartSection = () => {
  return (
    <Container
      sx={{
        borderRadius: 5,
        backgroundColor: colorsConst.expensesPieChart.backgroundColor,
        border: "2px black solid",
      }}
    >
      <ItinerarySelectorDropdown />
      <Container sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <ExpensesPieChart />
        <SpendingsBreakdown />
      </Container>
    </Container>
  );
};

export default ExpensesPieChartSection;
