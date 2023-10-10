"use client";

import { SessionProvider } from "next-auth/react";

import { NextUIProvider } from "@nextui-org/react";

export const UIProvider = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export const NextAuthProvider = ({children}) => {
  return <SessionProvider>{children}</SessionProvider>;
};