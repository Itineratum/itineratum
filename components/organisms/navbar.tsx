"use client";

import { TypographyVariant } from "@/constants/enums/theme";
import endpointsConst from "@/constants/pages/endpoints.json";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Text from "../atoms/text";
import CurrencySwitcher from "../molecules/currency-switcher";
import ItineratumLogo from "../molecules/itineratum-logo";
import LanguageSwitcher from "../molecules/language-switcher";
import NavbarItem from "../molecules/navbar-item";

const Navbar = ({ locale }: { locale: string }) => {
  const savedTrips = () => {
    return (
      <NavbarItem
        name={endpointsConst.savedTrips.name}
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
        name={endpointsConst.aboutUs.name}
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
        name={endpointsConst.contactUs.name}
        linkToPage={buildLocaleEndpoint(
          locale,
          endpointsConst.contactUs.endpoint
        )}
        icon={<PhoneInTalkOutlinedIcon />}
      />
    );
  };
  const dash = () => {
    return (
      <Box sx={{ ml: 1.5 }}>
        <Text text={"-"} variant={TypographyVariant.h4} bold={true} />
      </Box>
    );
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between", position: "relative" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ItineratumLogo params={{ locale }} />
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
