import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TelegramIcon from "@mui/icons-material/Telegram";
import InstagramIcon from "@mui/icons-material/Instagram";
import TiktokIcon from "@mui/icons-material/Movie"; // Replace with TikTok icon as needed
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "#1d3b50", padding: "40px 0", color: "#fff" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Stay Connected Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Stay connected!
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Name"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
              />
              <TextField
                label="Email Address"
                variant="outlined"
                size="small"
                sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
              />
              <Button variant="contained" color="secondary">
                Let's go
              </Button>
            </Stack>
          </Grid>

          {/* Navigation Links Section */}
          <Grid item xs={12} md={4}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              {/* Country Selector Placeholder */}
              <Typography variant="body1" sx={{ marginRight: "8px" }}>
                Singapore
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ marginTop: 2 }}>
              <Typography variant="body2">Home</Typography>
              <Typography variant="body2">Saved Trips</Typography>
              <Typography variant="body2">About Us</Typography>
              <Typography variant="body2">Contact Us</Typography>
            </Stack>

            {/* Social Media Icons */}
            <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
              <IconButton color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit">
                <TelegramIcon />
              </IconButton>
              <IconButton color="inherit">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit">
                <TiktokIcon />
              </IconButton>
              <IconButton color="inherit">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Copyright Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="body2"
              sx={{ textAlign: { xs: "center", md: "left" }, marginBottom: 2 }}
            >
              &copy; 2024 Itineratum Pte. Ltd. All Rights Reserved.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{ flexWrap: "wrap" }}
            >
              <Typography variant="body2">Terms & Conditions</Typography>
              <Typography variant="body2">Privacy Policy</Typography>
              <Typography variant="body2">Cookie Policy</Typography>
              <Typography variant="body2">Copyright Notification</Typography>
              <Typography variant="body2">Cookie Settings</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
