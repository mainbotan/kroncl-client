import { ComponentType } from "react";

export interface DivorceSection {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  accent?: boolean;
  href?: string;
}