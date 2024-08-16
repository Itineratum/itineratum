import { TypographyVariant } from "@/constants/enums/theme";
import { Button, Menu, MenuItem } from "@mui/material";
import { ReactNode, useState } from "react";
import NavbarIconText from "../atoms/navbar-icon-text";
import Text from "../atoms/text";

const ButtonMenu = ({
  id,
  text,
  icon,
  menuValues,
  itemChangeHandler,
}: {
  id: string;
  text: string;
  icon?: ReactNode | undefined;
  menuValues: Object;
  itemChangeHandler: (_: string) => void;
}) => {
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
    itemChangeHandler(item);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id={button}
        aria-controls={open ? menu : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "black", mx: 0.5 }}
      >
        {icon ? (
          <NavbarIconText icon={icon} text={text} />
        ) : (
          <Text text={text} variant={TypographyVariant.h4} bold={true} />
        )}
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
        {Object.keys(menuValues).map((item) => (
          <MenuItem key={item} onClick={() => handleMenuItemClick(item)}>
            {/* @ts-expect-error */}
            {menuValues[item]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ButtonMenu;
