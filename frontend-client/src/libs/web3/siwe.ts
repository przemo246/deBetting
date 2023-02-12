import { SiweMessage } from "siwe";

export const createSiweMessage = ({
  address,
  statement,
  chainId,
  nonce,
}: {
  address: string;
  statement: string;
  chainId: number;
  nonce: string;
}) => {
  const domain = window.location.host;
  const origin = window.location.origin;
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId,
    nonce,
  });
  return message.prepareMessage();
};
