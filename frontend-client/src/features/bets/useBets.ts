import { useEffect, useState } from "react";
import { useApi } from "../api";
import { useAuth } from "../auth";
import { BetWithMetadata } from "./types";

export const useBets = () => {
  const [bets, setBets] = useState<BetWithMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { authToken, isSignedIn } = useAuth();
  const fetchApi = useApi(authToken);
  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    const loadBets = async () => {
      const [response, error] = await fetchApi(`/bet`);
      if (error) {
        console.error({ error });
        setError(true);
        return;
      }
      setLoading(false);
      setBets(response);
    };
    loadBets();
  }, [authToken, isSignedIn]);
  return { bets, loading, error };
};
