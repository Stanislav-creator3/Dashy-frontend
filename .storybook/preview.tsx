import React from "react";
import "../src/app/styles/index";
import { Mulish, Source_Code_Pro } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import type { Preview } from "@storybook/nextjs-vite";

initialize({ onUnhandledRequest: "error" });

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

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
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: 0 } },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <div className={`font-sans ${mulish.variable}`}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
