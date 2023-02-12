import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  className?: string;
}>;

export const Container = ({ children, className = "" }: Props) => {
  return (
    <div
      className={clsx(
        "bg-secondary rounded-2xl p-10 flex items-center flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};
