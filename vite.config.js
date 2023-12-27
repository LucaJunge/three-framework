import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
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
