"use client";

import { TypographyVariant } from "@/constants/enums/theme";
import colorsConst from "@/constants/pages/colors.json";
import endpointsConst from "@/constants/pages/endpoints.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Text from "../atoms/text";
import CurrencySwitcher from "../molecules/currency-switcher";
import ItineratumLogo from "../molecules/itineratum-logo";
import LanguageSwitcher from "../molecules/language-switcher";
import NavbarItem from "../molecules/navbar-item";
import ProfileIcon from "../molecules/profile-icon";
import SignupLoginButtons from "../molecules/signup-login-buttons";

const Navbar = () => {
  const navBarWidth: string = "90%";
  const { data: session } = useSession();
  const t = useTranslations("navbar");
  const locale = useLocale();

  const savedTrips = () => {
    return (
      <NavbarItem
        name={t("savedTrips")}
        linkToPage={buildLocaleEndpoint(
          locale,
          endpointsConst.savedTrips.endpoint
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
          endpointsConst.aboutUs.endpoint
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
          endpointsConst.contactUs.endpoint
        )}
        icon={<PhoneInTalkOutlinedIcon />}
      />
    );
  };
  const dash = () => {
    const dashSpacing: number = 0.3;

    return (
      <Box sx={{ marginX: dashSpacing }}>
        <Text text={"-"} variant={TypographyVariant.h6} bold={true} />
      </Box>
    );
  };
  const account = () => {
    return (
      <Box sx={{ ml: 3 }}>
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

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar
        disableGutters
        sx={{
          justifyContent: "space-between",
          position: "relative",
          width: navBarWidth,
          margin: "0 auto",
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LanguageSwitcher locale={locale} />
          {dash()}
          <CurrencySwitcher />
          {account()}
        </Box>
      </Toolbar>
      {bottomBorder()}
    </AppBar>
  );
};

export default Navbar;
