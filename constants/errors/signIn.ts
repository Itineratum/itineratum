export enum SignInError {
  logInWithoutGoogle = "logInWithoutGoogle",
}

export const getSignInErrorMessage = (error: String) => {
  switch (error) {
    case SignInError.logInWithoutGoogle:
      return "Account already exists. Please log in without continuing with Google!";
    default:
      return "An error occured.";
  }
};
