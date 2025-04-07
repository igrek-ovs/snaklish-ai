export const PASSWORD_REGEX = {
    onlyLatin: {
        source: '^[a-zA-Z0-9!@#$%^&*]+$',
        errorMessage: 'Password must contain only latin letters',
    },
    atLeastOneDigit: {
        source: '^.*[0-9].*$',
        errorMessage: 'Password must have at least one digit',
    },
    atLeastOneUppercase: {
        source: '^.*[A-Z].*$',
        errorMessage: 'Password must have at least one uppercase letter',
    },
    atLeastOneLowercase: {
        source: '^.*[a-z].*$',
        errorMessage: 'Password must have at least one lowercase letter',
    },
    atLeastOneSpecialCharacter: {
        source: '^.*[!@#$%^&*].*$',
        errorMessage: 'Password must should (!@#$%^&*)',
    },
    defaultErrorMessage: 'Password is invalid',
}