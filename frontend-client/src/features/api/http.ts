import { joinUrls } from "./utils";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

type Params = {
  baseUrl?: string;
} & Omit<RequestInit, "method">;

const Headers: Record<string, string> = {};

export const setApiHeader = (key: string, value: string) => {
  Headers[key] = value;
};

const createMethod = (
  url: string,
  method: RequestInit["method"],
  params?: Params,
  includeHeaders = false,
) => {
  const { baseUrl, ...rest } = params ?? {};
  return fetch(joinUrls(baseUrl, API_BASE_URL, url), {
    method,
    ...rest,
    headers: {
      ...(includeHeaders ? Headers : {}),
      ...rest.headers,
    },
  }).then((res) => res.json());
};

// client with custom headers including authorization etc.
export const http = {
  get: (url: string, params?: Params) => createMethod(url, "GET", params, true),
  post: (url: string, params?: Params) =>
    createMethod(url, "POST", params, true),
};

// raw client including only default headers
export const rawHttp = {
  get: (url: string, params?: Params) => createMethod(url, "GET", params),
  post: (url: string, params?: Params) => createMethod(url, "POST", params),
};
