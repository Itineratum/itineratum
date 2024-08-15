import { NextFont } from "next/dist/compiled/@next/font";

export const getFontFamily = (font: NextFont): string => font.style.fontFamily;
