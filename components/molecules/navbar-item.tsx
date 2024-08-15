import { Box, Button } from "@mui/material";
import { ReactNode } from "react";
import Text from "../atoms/text";
import { TypographyVariant } from "@/constants/enums/theme";
import Link from "next/link";

const NavbarItem = ({
  name,
  linkToPage,
  icon
}: {
  name: string
  linkToPage: string,
  icon: ReactNode
}) => {
  return (
    <Link href={linkToPage}>
      <Button
        key={name}
        sx={{ 
          mx: 1.5, 
        }}
        color='secondary'
      >
        {icon}
        <Box sx={{ mx: 0.5 }} />
        <Text 
          text={name}
          variant={TypographyVariant.h4}
          bold={true}
        />
      </Button>
    </Link>
  );
}

export default NavbarItem;
