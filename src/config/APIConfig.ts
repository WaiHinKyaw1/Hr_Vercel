const MODE: string = "uat"; // development , production , uat
const DEV_API_BASE_URL = "http://127.0.0.1:8000/api";
const UAT_API_BASE_URL = "https://hruatapi.aryoneoo.biz/api";
const PRO_API_BASE_URL = "https://hrapi.aryoneoo.biz/api";

export const API_BASE_URL =
  MODE == "development"
    ? DEV_API_BASE_URL
    : MODE == "uat"
      ? UAT_API_BASE_URL
      : MODE == "production"
        ? PRO_API_BASE_URL
        : DEV_API_BASE_URL;
