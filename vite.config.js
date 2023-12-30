import { resolve } from "path"
import { defineConfig } from "vite"
import basicSsl from "@vitejs/plugin-basic-ssl"

export default defineConfig({
  server: {
    https: true,
  },
  plugins: [basicSsl()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/Entry.js"),
      name: "ThreeFramework",
      fileName: "three-framework",
    },
    rollupOptions: {
      external: ["three"],
      output: {
        globals: {
          three: "three",
        },
      },
    },
  },
})
