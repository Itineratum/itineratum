"use client";

import { keyframes } from "@emotion/react";
import { Box, Stack } from "@mui/material";
import Image from "next/image";

const animationDisplacement: number = 15;
const animationPeriod: number = 4;
const floatAnimationUp = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-${animationDisplacement}px); }
  100% { transform: translateY(0px); }
`;
const floatAnimationDown = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(${animationDisplacement}px); }
  100% { transform: translateY(0px); }
`;

const ImageColumn = ({ images, left }: { images: string[]; left: boolean }) => {
  const largeImageSize: number = 300;
  const smallImageSize: number = 165;
  const largeImageSizeMobile = largeImageSize / 2;
  const smallImageSizeMobile = smallImageSize / 2;
  const imageSpacing: number = 10;

  const getImageSize = (index: number, mobile: boolean) => {
    return left
      ? index % 2 === 0
        ? mobile
          ? smallImageSizeMobile
          : smallImageSize
        : mobile
          ? largeImageSizeMobile
          : largeImageSize
      : index % 2 === 0
        ? mobile
          ? largeImageSizeMobile
          : largeImageSize
        : mobile
          ? smallImageSizeMobile
          : smallImageSize;
  };

  const animation = (index: number, left: boolean) => {
    if (left) {
      return index === 0 ? floatAnimationUp : floatAnimationDown;
    } else {
      return index === 0 ? floatAnimationDown : floatAnimationUp;
    }
  };

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
        const fileName = src.split("/").pop();
        const imageSize = getImageSize(index, false);
        return (
          <Box
            key={fileName}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "50%",
              width: {
                xs: getImageSize(index, true),
                md: getImageSize(index, false),
              },
              height: {
                xs: getImageSize(index, true),
                md: getImageSize(index, false),
              },
              animation: `${animation(index, left)} ${animationPeriod}s ease-in-out infinite`,
            }}
          >
            <Image
              key={fileName}
              src={src}
              width={imageSize}
              height={imageSize}
              alt={`Travel Photo`}
              style={{ objectFit: "cover" }}
            />
          </Box>
        );
      })}
    </Stack>
  );
};

export default ImageColumn;
