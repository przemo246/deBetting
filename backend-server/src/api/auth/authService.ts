import { SiweMessage } from "siwe";
import { generateToken } from "../../middleware/authMiddleware";

export const verify = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}) => {
  if (!message || !signature) {
    return false;
  }
  const siweMessage = new SiweMessage(message);
  try {
    await siweMessage.validate(signature);
    return generateToken(siweMessage.address);
  } catch {
    return false;
  }
};
