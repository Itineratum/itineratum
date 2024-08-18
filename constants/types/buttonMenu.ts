import { ReactNode } from "react";

type ButtonMenuPropsWithLink = {
  id: string;
  text?: string;
  icon?: ReactNode;
  menuItems: Record<string, string>;
  useLink: true;
  itemChangeHandler?: (_: string) => void;
};

type ButtonMenuPropsWithoutLink = {
  id: string;
  text?: string;
  icon?: ReactNode;
  menuItems: Record<string, string>;
  useLink: false;
  itemChangeHandler: (_: string) => void;
};

export type ButtonMenuProps =
  | ButtonMenuPropsWithLink
  | ButtonMenuPropsWithoutLink;
