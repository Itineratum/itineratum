import { Typography } from "@mui/material";
import constEndpoints from "@/constants/pages/endpoints.json";
import constTexts from "@/constants/pages/texts.json";

const ItineratumLogo = () => {
  return (
    <div>
      <Typography
        variant="h5"
        noWrap
        component="a"
        href={constEndpoints.home.link}
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontWeight: 700,
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {constTexts.pageTitle}
      </Typography>
    </div>
  );
}

export default ItineratumLogo;
