// API Configuration Constants

const SERVER_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en'

export const API_CONFIG = {
  BASE_URL: SERVER_URL,
  TIMEOUT: 60000,
};

export const API_ENDPOINTS = {
SEARCH:(word: string) => `${SERVER_URL}/${word}`,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}