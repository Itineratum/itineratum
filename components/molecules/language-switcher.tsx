"use client";

import { languages, usePathname, useRouter } from "@/navigation";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import NavbarIconText from "./navbar-icon-text";

const LanguageSwitcher = ({ locale }: { locale: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const languageSwitcherButton: string = "language-switcher-button";
  const languageSwitcherMenu: string = "language-switcher-menu";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLanguageChange = (language: string) => {
    router.push(pathname, { locale: language });
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id={languageSwitcherButton}
        aria-controls={open ? languageSwitcherMenu : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "black" }}
      >
        <NavbarIconText
          icon={<LanguageOutlinedIcon />}
          text={locale.toUpperCase()}
        />
      </Button>
      <Menu
        id={languageSwitcherMenu}
        aria-labelledby={languageSwitcherButton}
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
        {Object.keys(languages).map((language) => (
          <MenuItem
            key={language}
            onClick={() => handleLanguageChange(language)}
          >
            {/* @ts-expect-error */}
            {languages[language]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
