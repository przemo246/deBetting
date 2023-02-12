import { createSiweMessage } from "@/libs/web3/siwe";
import { Goerli, Mainnet, useEthers, Hardhat } from "@usedapp/core";
import { useApi } from "@/fatures/api";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

const TOKEN_STORAGE_KEY = "API_TOKEN";

const useAuthContextController = () => {
  const { account, library, chainId } = useEthers();
  const [authToken, setAuthToken] = useState("");
  const fetchApi = useApi();

  const isCorrectNetwork =
    chainId === Goerli.chainId || chainId === Mainnet.chainId;

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem(
      `${TOKEN_STORAGE_KEY}:${account}`,
    );
    if (
      !account ||
      !library ||
      !chainId ||
      !isCorrectNetwork ||
      (authToken && tokenFromLocalStorage) || // token defined but to the wrong address
      !("getSigner" in library) // in case provider is a FallbackProvider for some reason
    ) {
      return;
    }

    if (tokenFromLocalStorage) {
      setAuthToken(tokenFromLocalStorage);
      console.log("Signed in with ethereum! [got token from storage]");
      return;
    }

    const signIn = async () => {
      const signer = library.getSigner();
      const [nonce, nonceError] = await fetchApi(`/auth/nonce`);
      if (nonceError) {
        console.error({ nonceError });
        return;
      }
      const message = createSiweMessage({
        address: account,
        statement: "Sign in with Ethereum to the app.",
        chainId,
        nonce,
      });
      const signature = await signer.signMessage(message);
      const [authToken, verifyError] = await fetchApi(`/auth/verify`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ message, signature }),
      });
      if (verifyError) {
        console.error({ verifyError });
        return;
      }
      setAuthToken(authToken.toString());
      localStorage.setItem(
        `${TOKEN_STORAGE_KEY}:${account}`,
        authToken.toString(),
      );
      console.log("Signed in with ethereum! [got token from api]");
    };
    signIn();
  }, [authToken, account, library, isCorrectNetwork]);

  return useMemo(
    () => ({
      isSignedIn: !!authToken,
      authToken,
      isCorrectNetwork,
    }),
    [authToken],
  );
};

const AuthContext = createContext<ReturnType<
  typeof useAuthContextController
> | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const value = useAuthContextController();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
