'use client';

import endpointsConst from "@/constants/pages/endpoints.json";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import ItineratumLogo from '../molecules/itineratum-logo';
import NavbarItem from '../molecules/navbar-item';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      color="primary"
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ mx: 5 }} />
          <ItineratumLogo />
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
          }}>
            <Box sx={{ mx: 2 }} />
            <NavbarItem 
              name={endpointsConst.savedTrips.name} linkToPage={endpointsConst.savedTrips.link}
              icon={<FavoriteBorderOutlinedIcon />}
            />
            <NavbarItem 
              name={endpointsConst.aboutUs.name} 
              linkToPage={endpointsConst.aboutUs.link}
              icon={<PeopleAltOutlinedIcon />}
            />
            <NavbarItem 
              name={endpointsConst.contactUs.name} 
              linkToPage={endpointsConst.contactUs.link}
              icon={<PhoneInTalkOutlinedIcon />}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
