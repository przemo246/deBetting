import { Bet } from "./enums";

export type FixtureLocal = {
  id: number;
  bet?: Bet;
  teamName?: string;
  betAmount?: string;
};

export type NotificationProps = {
  variant: Variant;
  message: string;
};

export type Variant = "error" | "success" | "warning" | "info";
