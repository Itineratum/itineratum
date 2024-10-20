export const emailParser = (email: string): string => {
  return `mailto:${email}`;
};

export const phoneParser = (phoneNumber: string): string => {
  return `tel:${phoneNumber}`;
};
