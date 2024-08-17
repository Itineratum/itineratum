/**
 * Returns the endpoint with the locale (langugage).
 *
 * @param locale - The locale
 * @param endpoint - The endpoint
 * @returns The formatted string of the endpoint with the locale
 *
 */
export const buildLocaleEndpoint = (
  locale: string,
  endpoint: string
): string => {
  return `/${locale}/${endpoint}`;
};
