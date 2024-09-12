/**
 * Converts an enum to a format that zod accepts as enum
 * 
 * @param input The enum
 * @returns The object that zod accpets as enum
 */
export const enumToZod = (input: any): [string, ...string[]] => {
  return Object.keys(input) as [string, ...string[]];
}