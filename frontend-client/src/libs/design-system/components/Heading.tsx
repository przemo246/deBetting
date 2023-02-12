import clsx from "clsx";
import { PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "tertiary";

type Props = PropsWithChildren<{ variant?: Variant; className?: string }>;

const baseClassNames = "text-white";

const variantClassNameMap: Record<Variant, string> = {
  primary: "text-3xl",
  secondary: "text-2xl",
  tertiary: "text-xl",
};

export const Heading = ({
  variant = "primary",
  children,
  className,
}: Props) => {
  if (variant === "primary") {
    return (
      <h1
        className={clsx(
          baseClassNames,
          variantClassNameMap[variant],
          className,
        )}
      >
        {children}
      </h1>
    );
  } else if (variant === "secondary") {
    return (
      <h2
        className={clsx(
          baseClassNames,
          variantClassNameMap[variant],
          className,
        )}
      >
        {children}
      </h2>
    );
  } else {
    return (
      <h3
        className={clsx(
          baseClassNames,
          variantClassNameMap[variant],
          className,
        )}
      >
        {children}
      </h3>
    );
  }
};
