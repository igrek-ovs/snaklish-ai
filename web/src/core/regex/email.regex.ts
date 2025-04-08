export const EMAIL_REGEX = {
  twoSymbolsAfterDot: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  atLeastOneDigit: /(?=.*\d)/,
  atLeastOneLowercase: /(?=.*[a-z])/,
};
