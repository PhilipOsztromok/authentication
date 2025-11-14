export default  {
    SUCCESS: 'The operation has been successful',
    CREATED: 'The resource has been created successfully',
    UPDATED: 'The resource has been updated successfully',
    DELETED: 'The resource has been deleted successfully',

    AUTH: {
        LOGIN_SUCCESS: 'Login successful',
        LOGIN_FAILED: 'Invalid email or password',
        UNAUTHORIZED: 'You are not authorized to access this resource',
        FORBIDDEN: 'You do not have permission to perform this action',
        TOKEN_EXPIRED: 'Authentication token has expired',
        TOKEN_INVALID: 'Authentication token is invalid',
        ALREADY_EXIST: (entity, value) => `${entity} with value ${value} already exists`,
        INVALID_PHONE_NUMBER: 'Invalid phone number provided',
        ACCOUNT_ALREADY_CONFIRMED: 'Account already confirmed',
        ACCOUNT_NOT_CONFIRMED: 'Account not confirmed',
    },

    VALIDATION: {
        FAILED: 'Validation failed',
        REQUIRED_FIELDS_MISSING: 'Required fields are missing',
        INVALID_EMAIL: 'The email address provided is invalid',
        PASSWORD_TOO_WEAK: 'The password provided is too weak',
        PASSWORDS_DO_NOT_MATCH: 'The passwords provided do not match'       
    },

    ERROR: {
        SOMETHING_WENT_WRONG: 'Something went wrong!',
        INTERNAL_SERVER_ERROR: 'Internal server error',
        NOT_FOUND: (entity) => `${entity} not found`,
        ALREADY_EXISTS: (entity) => `${entity} already exists`,
        TOO_MANY_REQUESTS: 'Too many requests! Please try again after some time',
        BAD_REQUEST: 'Bad request',
        DATABASE_ERROR: 'A database error occurred',
        SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    },

    COMMON: {
        INVALID_PARAMETERS: 'Invalid parameters provided',
        ACTION_NOT_ALLOWED: 'This action is not allowed',
        OPERATION_FAILED: (operation) => `${operation} operation failed`,
        OPERATION_SUCCESS: (operation) => `${operation} operation succeeded`,
        FAILED_TO_SAVE: (entity) => `Failed to save ${entity}`,
    },

    customMessage: (message) => message,
};