"use client";

import endpointsConst from "@/constants/pages/endpoints.json";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import ItineratumLogo from "../molecules/itineratum-logo";
import LanguageSwitcher from "../molecules/language-switcher";
import NavbarItem from "../molecules/navbar-item";
import { buildLocaleEndpoint } from "@/utils/buildLocaleEndpoint";

const Navbar = ({ params: { locale } }: { params: { locale: string } }) => {
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

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ mx: 5 }} />
          <ItineratumLogo
            params={{
              locale: locale,
            }}
          />
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <Box sx={{ mx: 2 }} />
            {savedTrips()}
            {aboutUs()}
            {contactUs()}
          </Box>
          <LanguageSwitcher locale={locale} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
