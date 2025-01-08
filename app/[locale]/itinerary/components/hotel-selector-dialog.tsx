import { Hotel } from "@/lib/pythonBackend/types";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

const HotelSelectorDialog = ({
  open,
  setOpen,
  hotels,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  hotels: Hotel[];
}) => {
  const handleOnClose = () => {
    setOpen(false);
  };

  console.log(hotels);

  return (
    <Dialog
      open={open}
      fullScreen={false}
      onClose={handleOnClose}
      maxWidth={false}
    >
      <DialogTitle></DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default HotelSelectorDialog;
