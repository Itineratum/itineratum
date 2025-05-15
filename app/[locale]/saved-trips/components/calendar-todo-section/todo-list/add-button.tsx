import colorsConst from "@/constants/pages/colors.json";
import { useSavedTrips } from "@/hooks/useSavedTrips";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const AddButton = () => {
  const { setShowAddToDoDialog } = useSavedTrips();

  const handleOnClick = () => {
    setShowAddToDoDialog(true);
  };

  return (
    <IconButton
      onClick={handleOnClick}
      sx={{ color: colorsConst.palette.text.primary }}
    >
      <AddIcon />
    </IconButton>
  );
};

export default AddButton;
