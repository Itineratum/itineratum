import { TypographyVariant } from "@/constants/enums/theme";
import { ButtonMenuProps } from "@/constants/types/buttonMenu";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import LinkMenuItem from "../atoms/link-menu-item";
import NavbarIconText from "../atoms/navbar-icon-text";
import Text from "../atoms/text";

const ButtonMenu = ({
  id,
  text = "",
  icon,
  menuItems,
  useLink,
  itemChangeHandler,
}: ButtonMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const button: string = `${id}-button`;
  const menu: string = `${id}-menu`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (item: string) => {
    if (!useLink) itemChangeHandler(item);
    setAnchorEl(null);
  };

  const buttonElement = icon ? (
    <NavbarIconText icon={icon} text={text} />
  ) : (
    <Text text={text} variant={TypographyVariant.h4} bold={true} />
  );
  const menuElement = Object.keys(menuItems).map((item) =>
    useLink ? (
      <LinkMenuItem
        item={item}
        text={menuItems[item]}
        handleClose={handleClose}
      />
    ) : (
      <MenuItem key={item} onClick={() => handleMenuItemClick(item)}>
        {menuItems[item]}
      </MenuItem>
    ),
  );

  return (
    <div>
      <Button
        id={button}
        aria-controls={open ? menu : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "text.primary", mx: 0.5 }}
      >
        {buttonElement}
      </Button>
      <Menu
        id={menu}
        aria-labelledby={button}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {menuElement}
      </Menu>
    </div>
  );
};

export default ButtonMenu;
