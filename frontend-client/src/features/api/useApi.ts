import { useCallback } from "react";

export const useApi = (token?: string) => {
  const fetchApi = useCallback(
    async (
      path: string,
      requestConfig?: RequestInit,
      baseUrl?: string,
    ): Promise<[any, boolean]> => {
      const response = await fetch(
        `${baseUrl ?? import.meta.env.VITE_BACKEND_URL}${path}`,
        {
          ...requestConfig,
          headers: {
            ...requestConfig?.headers,
            Authorization: token || "",
          },
        },
      );

      return [await response.json(), !response.ok];
    },
    [token],
  );

  return fetchApi;
};
