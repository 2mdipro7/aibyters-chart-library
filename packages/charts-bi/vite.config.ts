import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({ insertTypesEntry: true })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@aibyters/charts-bi",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`
    },
    rollupOptions: {
      external: [
        "react", 
        "react/jsx-runtime",
        "react-dom", 
        "recharts", 
        "lucide-react",
        "@aibyters/spec",
        "@aibyters/core",
        "@aibyters/layout"
      ]
    }
  }
});
