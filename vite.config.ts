import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Toads",
      fileName: (format) => `toads.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
  },
  plugins: [
    dts({
      outDir: "dist/types",
    }),
  ],
});
