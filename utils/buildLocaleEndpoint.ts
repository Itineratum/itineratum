export const buildLocaleEndpoint = (
  locale: string,
  endpoint: string
): string => {
  return `/${locale}/${endpoint}`;
};
