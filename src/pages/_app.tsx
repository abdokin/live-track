import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useState } from "react";
import type { ColorScheme } from "@mantine/core";

import en from "~/lang/en.json";
import fr from "~/lang/fr.json";
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <SessionProvider session={session}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Toaster position="top-right" />
          <Component {...pageProps} />
        </MantineProvider>
      </ColorSchemeProvider>
      {/* </ColorSchemeProvider> */}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
