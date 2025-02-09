import darkBlueGuy from "@/public/dark_blue_guy.svg";
import lightBlueGuy from "@/public/light_blue_guy.svg";
import orangeGuy from "@/public/orange_guy.svg";
import { Box } from "@mui/material";
import Image from "next/image";

const ThreeGuysBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "auto",
        minHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: { xs: "none", md: "inherit" } }}>
        <Image
          src={orangeGuy}
          alt="Orange Guy"
          style={{ position: "absolute", top: "0%", right: "-10%", zIndex: -1 }}
        />
      </Box>
      <Box sx={{ display: { xs: "none", md: "inherit" } }}>
        <Image
          src={darkBlueGuy}
          alt="Dark Blue Guy"
          style={{ position: "absolute", top: "50%", left: "0%", zIndex: -1 }}
        />
      </Box>
      <Box sx={{ display: { xs: "none", md: "inherit" } }}>
        <Image
          src={lightBlueGuy}
          alt="Light Blue Guy"
          style={{
            position: "absolute",
            bottom: "0%",
            left: "90%",
            transform: "translateX(-50%)",
            zIndex: -1,
          }}
        />
      </Box>
      {children}
    </Box>
  );
};

export default ThreeGuysBackground;
