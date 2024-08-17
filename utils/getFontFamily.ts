import { NextFont } from "next/dist/compiled/@next/font";

/**
 * Returns the font family of the font.
 *
 * @param font - The front from which the font family is to be extracted from
 * @returns The font family of the font
 */
export const getFontFamily = (font: NextFont): string => font.style.fontFamily;
