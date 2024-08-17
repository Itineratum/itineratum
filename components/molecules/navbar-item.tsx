import { Button } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";
import NavbarIconText from "../atoms/navbar-icon-text";

const NavbarItem = ({
  name,
  linkToPage,
  icon = <></>,
}: {
  name: string;
  linkToPage: string;
  icon?: ReactNode;
}) => {
  return (
    <Link href={linkToPage}>
      <Button
        key={name}
        sx={{
          mx: 2.5,
        }}
        color="secondary"
      >
        <NavbarIconText icon={icon} text={name} />
      </Button>
    </Link>
  );
};

export default NavbarItem;
