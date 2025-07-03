export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: "All fields are required.",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters long.",
  EMAIL_ALREADY_EXISTS: "Email already registered.",
  INVALID_CREDENTIALS: "Invalid credentials.",
  USER_NOT_AUTHENTICATED: "User not authenticated.",
  USER_NOT_FOUND: "User not found.",
  INVALID_IMAGE_FORMAT: "Invalid image format.",
  INTERNAL_SERVER_ERROR: "Internal server error.",
  TOKEN_MISSING: "Access token required.",
  TOKEN_INVALID: "Invalid access token.",
  TOKEN_EXPIRED: "Access token expired. Please refresh your token.",
  AUTH_FAILED: "Authentication failed.",
} as const;

export const SUCCESS_MESSAGES = {
  LOGOUT_SUCCESS: "Logout successful.",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
