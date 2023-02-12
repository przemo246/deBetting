import { useEthers } from "@usedapp/core";
import { formatAddress } from "@/libs/web3/utils";
import { Button, Heading } from "@/libs/design-system";
import { useAuth } from "@/fatures/auth";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  const { account, deactivate, activateBrowserWallet } = useEthers();
  const { isSignedIn, isCorrectNetwork } = useAuth();

  return (
    <div className="flex justify-between items-center mb-10">
      <Heading>{title}</Heading>
      <Button onClick={account ? deactivate : activateBrowserWallet}>
        {account
          ? isSignedIn
            ? formatAddress(account)
            : "Waiting for signature..."
          : "Connect"}
      </Button>
    </div>
  );
};
