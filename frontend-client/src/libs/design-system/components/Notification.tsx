import { PropsWithChildren, ReactNode } from "react";

import { ErrorIcon } from "@/assets/icons/ErrorIcon";
import { InfoIcon } from "@/assets/icons/InfoIcon";
import { SuccessIcon } from "@/assets/icons/SuccessIcon";
import { WarningIcon } from "@/assets/icons/WarningIcon";
import { Variant } from "../../../types/types";

type Props = PropsWithChildren<{
  variant?: Variant;
  message: string;
  className?: string;
}>;

const iconsMapping: Record<Variant, ReactNode> = {
  error: <ErrorIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

const baseClassNames =
  "alert fixed shadow-lg w-1/4 z-10 left-[85%] top-[92%] translate-x-[-50%] translate-y-[-50%]";

export const Notification = ({
  variant = "success",
  message,
  className,
}: Props) => {
  return (
    <div className={`${baseClassNames} alert-${variant} ${className}`}>
      <div>
        {iconsMapping[variant]}
        <span>{message}</span>
      </div>
    </div>
  );
};
