import { HotelSelectorContext } from "@/contexts/hotelSelectorContext";
import { useContext } from "react";

export const useHotelSelector = () => {
  const context = useContext(HotelSelectorContext);

  if (!context) {
    throw new Error(
      "useHotelSelector must be used within an HotelSelectorProvider"
    );
  }

  return context;
};
