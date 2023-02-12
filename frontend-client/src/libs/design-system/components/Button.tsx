import clsx from "clsx";
import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type PropsWithChildren,
} from "react";
import { Button as DaisyUIButton } from "react-daisyui";

type Variant = "primary" | "secondary" | "tertiary";

type Props = PropsWithChildren<{ variant?: Variant }> &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const variantClassNameMap: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl shadow-lg transition-shadow hover:shadow-sm transition-shadow px-10 py-3",
  secondary:
    "btn-outline rounded-sm border border-neutral-400 bg-secondary w-12 h-12 hover:bg-white hover:text-primary focus:bg-white focus:text-primary transition-[background-color]",
  tertiary: "bg-red-500 hover:bg-red-700",
};

const baseClassNames = "text-white font-normal";

export const Button = ({
  variant = "primary",
  type = "button",
  children,
  className,
  color,
  ref,
  ...props
}: Props) => {
  return (
    <DaisyUIButton
      type={type}
      className={clsx(baseClassNames, variantClassNameMap[variant], className)}
      {...props}
    >
      {children}
    </DaisyUIButton>
  );
};
