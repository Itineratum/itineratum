import { TypographyVariant } from "@/constants/enums/theme";
import {
  default as constEndpoints,
  default as endpointsConst,
} from "@/constants/pages/endpoints.json";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Button, Menu, MenuItem } from "@mui/material";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LinkMenuItem from "../atoms/link-menu-item";
import Text from "../atoms/text";

const ProfileIcon = () => {
  const id: string = "profile-icon";
  const button: string = `${id}-button`;
  const menu: string = `${id}-menu`;
  const t = useTranslations();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileIconMenu, setProfileIconMenu] = useState<
    Record<string, string>
  >({});
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const menuItems: Record<string, string> = {};
    endpointsConst.profileIcon.actions.map((profileAction) => {
      menuItems[profileAction.endpoint] = profileAction.name;
    });
    setProfileIconMenu(menuItems);
  }, []);

  const accountMenuItem = () => {
    return (
      <LinkMenuItem
        item={"account"}
        text={t("navbar.account.account")}
        handleClose={handleClose}
      />
    );
  };
  const signOutMenuItem = () => {
    return (
      <MenuItem
        onClick={() => signOut({ callbackUrl: constEndpoints.home.endpoint })}
      >
        <Text
          text={t("navbar.account.signOut")}
          variant={TypographyVariant.h4}
          bold={false}
        />
      </MenuItem>
    );
  };

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
        <PersonOutlineOutlinedIcon />
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
        {accountMenuItem()}
        {signOutMenuItem()}
      </Menu>
    </div>
  );
};

export default ProfileIcon;
