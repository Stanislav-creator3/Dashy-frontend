import React, { useEffect } from "react";
import "../src/app/styles/index";
import { Geist, Mulish, Source_Code_Pro } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import type { Preview } from "@storybook/nextjs-vite";

initialize({ onUnhandledRequest: "error" });

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

// Как в app/layout.tsx: переменные шрифтов должны быть на <html>,
// иначе body { font-family: var(--font-mulish) } их не увидит
const fontClasses = [
  "font-sans",
  geist.variable,
  mulish.variable,
  sourceCodePro.variable,
];

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        document.documentElement.classList.add(...fontClasses);
        return () => document.documentElement.classList.remove(...fontClasses);
      }, []);

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 0 } },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
