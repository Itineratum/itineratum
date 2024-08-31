/**
 * Checks whether the input email is of a valid format
 *
 * @param email The input email to be validated
 * @returns True if the input email is valid, else, return false
 */
export const isValidEmail = (email: string): boolean => {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

/**
 * Checks whether the input password is of a valid format, where it has at least 8 characters, at least 1 lower-case alphabet, at least 1 upper-case alphabet, and at least 1 special character
 *
 * @param password The input password to be validated
 * @returns True if the input password is valid, else, return false
 */
export const isValidPassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  return regex.test(password);
};
