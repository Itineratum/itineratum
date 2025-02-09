"use client";

import colorsConst from "@/constants/pages/colors.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import CurrencySwitcher from "../molecules/currency-switcher";
import ItineratumLogo from "../molecules/itineratum-logo";
import NavbarItem from "../molecules/navbar-item";
import ProfileIcon from "../molecules/profile-icon";
import SignupLoginButtons from "../molecules/signup-login-buttons";

const Navbar = () => {
  const { data: session } = useSession();
  const t = useTranslations("navbar");
  const locale = useLocale();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const navBarWidth: string = "90%";
  const navBarMarginBottom: string = "20px";
  const margin = 1;
  const currencySwitcherAccountGap = 4;

  const savedTrips = () => {
    return (
      <NavbarItem
        name={t("savedTrips")}
        linkToPage={buildLocaleEndpoint(
          locale,
          endpointsConst.savedTrips.endpoint,
        )}
        icon={<FavoriteBorderOutlinedIcon />}
      />
    );
  };

  const aboutUs = () => {
    return (
      <NavbarItem
        name={t("aboutUs")}
        linkToPage={buildLocaleEndpoint(
          locale,
          endpointsConst.aboutUs.endpoint,
        )}
        icon={<PeopleAltOutlinedIcon />}
      />
    );
  };

  const contactUs = () => {
    return (
      <NavbarItem
        name={t("contactUs")}
        linkToPage={buildLocaleEndpoint(
          locale,
          endpointsConst.contactUs.endpoint,
        )}
        icon={<PhoneInTalkOutlinedIcon />}
      />
    );
  };

  const account = () => {
    return (
      <Box sx={{ ml: margin }}>
        {session?.user?.email ? <ProfileIcon /> : <SignupLoginButtons />}
      </Box>
    );
  };

  const bottomBorder = () => {
    const borderHeight: string = "2px";
    const borderWidth: string = "100%";

    return (
      <Box
        sx={{
          height: borderHeight,
          backgroundColor: colorsConst.palette.text.primary,
          width: borderWidth,
          margin: "0 auto",
        }}
      />
    );
  };

  const drawerContentForMobile = () => {
    return (
      <Box
        display="flex"
        sx={{
          padding: 2,
          mr: margin,
          flexDirection: "column",
          alignItems: "flex-end",
        }}
        onClick={() => setDrawerOpen(false)}
        onKeyDown={() => setDrawerOpen(false)}
      >
        {account()}
        {savedTrips()}
        {aboutUs()}
        {contactUs()}
        <Box sx={{ ml: margin }}>
          <CurrencySwitcher />
        </Box>
      </Box>
    );
  };

  const hamburgerIconForMobile = () => {
    return (
      <Box sx={{ display: { xs: "flex", md: "none" }, px: 1 }}>
        <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
          <MenuIcon />
        </IconButton>
      </Box>
    );
  };

  const drawerForMobile = () => {
    return (
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "60%",
          },
        }}
      >
        {drawerContentForMobile()}
      </Drawer>
    );
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          marginBottom: navBarMarginBottom,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            position: "relative",
            width: { xs: "100%", md: navBarWidth },
            margin: { xs: 0, md: "0 auto" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ItineratumLogo />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
            }}
          >
            {savedTrips()}
            {aboutUs()}
            {contactUs()}
          </Box>
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            gap={currencySwitcherAccountGap}
          >
            {/* <LanguageSwitcher locale={locale} /> */}
            <CurrencySwitcher />
            {account()}
          </Box>
          {hamburgerIconForMobile()}
        </Toolbar>
        {bottomBorder()}
      </AppBar>
      {drawerForMobile()}
    </>
  );
};

export default Navbar;
