import useSWR from "swr";
import { fetchBet } from "./requests";

export const useBet = (id: string) => useSWR(id, () => fetchBet(id));
