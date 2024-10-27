"use client";

import { keyframes } from "@emotion/react";
import { Box, Stack } from "@mui/material";
import Image from "next/image";

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const ImageColumn = ({ images, left }: { images: string[]; left: boolean }) => {
  const largeImageSize: number = 300;
  const smallImageSize: number = 165;
  const imageSpacing: number = 10;

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      spacing={imageSpacing}
    >
      {images.map((src, index) => {
        const imageSize = left
          ? index % 2 == 0
            ? smallImageSize
            : largeImageSize
          : index % 2 == 0
            ? largeImageSize
            : smallImageSize;

        return (
          <Box
            key={index}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "50%",
              width: imageSize,
              height: imageSize,
              animation: `${floatAnimation} 6s ease-in-out infinite`,
            }}
          >
            <Image
              src={src}
              width={imageSize}
              height={imageSize}
              alt={`Travel Photo ${index}`}
            />
          </Box>
        );
      })}
    </Stack>
  );
};

export default ImageColumn;
