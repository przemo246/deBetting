import { useEffect, useState } from "react";
import { useApi } from "../api";
import { FixtureWithMetadata } from "./types";

export const useFixtures = () => {
  const [fixtures, setFixtures] = useState<FixtureWithMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const fetchApi = useApi();
  useEffect(() => {
    const loadFixtures = async () => {
      const [response, error] = await fetchApi(`/fixture/`);
      if (error) {
        console.error({ error });
        setError(true);
        return;
      }
      setLoading(false);
      setFixtures(response);
    };
    loadFixtures();
  }, []);
  return { fixtures, loading, error };
};
