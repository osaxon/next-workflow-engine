"use client";
import { QueryClient, QueryClientProvider as ReactQueryProvider } from "@tanstack/react-query";

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <ReactQueryProvider client={queryClient}>
      {children}
    </ReactQueryProvider>
  );
}