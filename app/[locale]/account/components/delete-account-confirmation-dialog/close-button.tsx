import { usePersonalInformation } from "@/hooks/usePersonalInformation";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CloseButton = () => {
  const { closeConfirmDeleteDialog } = usePersonalInformation();

  return (
    <IconButton
      onClick={closeConfirmDeleteDialog}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
