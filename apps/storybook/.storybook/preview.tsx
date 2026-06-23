import type { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "@aibyters/theme";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'light',
          value: '#f8fafc',
        },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.backgrounds?.value === '#f8fafc' ? 'light' : 'dark';
      return (
        <ThemeProvider theme={theme}>
          <div className="p-8">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
