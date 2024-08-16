import { TypographyVariant } from "@/constants/enums/theme";
import { Box } from "@mui/material";
import { ReactNode } from "react";
import Text from "./text";

const NavbarIconText = ({ icon, text }: { icon: ReactNode; text: string }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {icon}
      <Box sx={{ mx: 0.5 }} />
      <Text text={text} variant={TypographyVariant.h4} bold={true} />
    </Box>
  );
};

export default NavbarIconText;
