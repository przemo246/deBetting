import clsx from "clsx";

type Props = {
  tokenName: string;
  className?: string;
  size?: number;
};

export const TokenIcon = ({ tokenName, className, size }: Props) => {
  const token = tokenName.toLowerCase();
  const url = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/icon/${token}.png`;

  return (
    <img
      style={{ width: size, height: size }}
      className={clsx(className, "flex-shrink-0")}
      src={url}
      alt={token}
    />
  );
};
