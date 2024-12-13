"use client";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const Template = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Template;
