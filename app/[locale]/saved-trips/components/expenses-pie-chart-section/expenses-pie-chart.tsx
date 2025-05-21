import colorsConst from "@/constants/pages/colors.json";
import { PieChart } from "@mui/x-charts/PieChart";
import { SAVED_TRIPS_STYLES } from "../styles";

const ExpensesPieChart = () => {
  const styles = SAVED_TRIPS_STYLES.EXPENSES_PIE_CHART_SECTION;
  const colors = colorsConst.expensesPieChart;

  const data = [
    { id: "transport", value: 15, label: "Transport" },
    { id: "attraction", value: 60, label: "Attraction" },
    { id: "food", value: 25, label: "Food" },
  ];
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { fade: "none", highlight: "item" },
          highlighted: { innerRadius: styles.PIE_CHART_SIZE / 5 },
          arcLabel: (item) => {
            const percentage = (item.value / totalValue) * 100;
            return `${Number.isInteger(percentage) ? percentage : percentage.toFixed(2)}%`;
          },
          innerRadius: styles.PIE_CHART_SIZE / 4,
          outerRadius: styles.PIE_CHART_SIZE / 2,
          arcLabelRadius: styles.PIE_CHART_SIZE / 1.5,
          labelMarkType: "square",
        },
      ]}
      colors={[colors.transportColor, colors.attractionColor, colors.foodColor]}
      width={styles.PIE_CHART_SIZE + styles.PIE_CHART_PADDING}
      height={styles.PIE_CHART_SIZE + styles.PIE_CHART_PADDING}
      slotProps={{
        legend: {
          position: {
            vertical: "bottom",
            horizontal: "center",
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
  );
};

export default ExpensesPieChart;
