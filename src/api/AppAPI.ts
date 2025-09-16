
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "config";
import { getSession, signOut } from "next-auth/react";
import * as Router from "next/navigation";

const AppAPI = axios.create({
  baseURL: API_BASE_URL,
});

AppAPI.interceptors.request.use(async (request) => {
  if (!isAccessTokenAttachedToAxiosDefaults()) {
    await setAccessTokenOnRequestAndAsAxiosDefaults(request);
  }
  return request;
});

AppAPI.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to
    // Do something with response data
    return response;
  },
  async function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to
    // Do something with response error
    if (error.response) {
      if (error.response.status === 401) {
        try {
          await signOut({
            redirect: false,
          });
          unsetAccessTokenAttachedToAxiosDefaults();
          const router = Router.useRouter();
          router.replace("/login");
        } catch (error) {
          console.log(error);
        }
      }
    }
    return Promise.reject(error);
  }
);

const isAccessTokenAttachedToAxiosDefaults = () => {
  const authHeader = AppAPI.defaults.headers.common["Authorization"];
  if (authHeader === null || authHeader === undefined || authHeader === "") return false;
  else return true;
};

const setAccessTokenOnRequestAndAsAxiosDefaults = async (request: AxiosRequestConfig) => {
  const session = await getSession();
  if (session) {
    const AuthHeaderValue = `Bearer ${session?.user?.access_token}`;
    if (!request.headers) request.headers = {};
    request.headers.Authorization = AuthHeaderValue;
    AppAPI.defaults.headers.common["Authorization"] =
      AuthHeaderValue; /* NOTE - This is to prevent calling getSession() again and again for each request.
                                    Because getSession() internally calls api/auth/session, which would be very expensive to do
                                    for each request to our backend [Call to this API was consuming around 10% of our bandwidth provided to us by vercel].
                                    It will not only lead to increase in costs but also increase time to perform each request as
                                    we have to every-time make a remote call to /api/auth/session. */
  }
};

export const unsetAccessTokenAttachedToAxiosDefaults = () => {
  delete AppAPI.defaults.headers.common["Authorization"];
};

export default AppAPI;
