import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";

const queryClient = new QueryClient();

export default function App({ Component, pageProps, session }) {
  return (
    <>
      <Head>
        <title>Chan</title>
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
