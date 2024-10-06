export enum SignInError {
  logInWithoutGoogle = "logInWithoutGoogle",
  wrongGoogleEmail = "wrongGoogleEmail",
}

export const getSignInErrorMessage = (error: String) => {
  switch (error) {
    case SignInError.logInWithoutGoogle:
      return "Account already exists. Please log in without continuing with Google!";
    case SignInError.wrongGoogleEmail:
      return "Wrong Google acocunt email! Please select the correct one matching the email you signed up with!";
    default:
      return "An error occured.";
  }
};
