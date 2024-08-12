'use client';

import { Button } from "@mui/material";

const NavbarItem = ({
  name,
  linkToPage
}: {
  name: string
  linkToPage: string
}) => {
  return (
    <Button
      key={name}
      href={linkToPage}
      sx={{ my: 2, color: 'white', display: 'block' }}
    >
      {name}
    </Button>
  );
}

export default NavbarItem;
