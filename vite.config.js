import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const httpsKeyPath = "./localhost+2-key.pem";
const httpsCertPath = "./localhost+2.pem";
const hasHttpsCerts =
  fs.existsSync(httpsKeyPath) && fs.existsSync(httpsCertPath);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.jsx",
  },
  server: {
    https: hasHttpsCerts
      ? {
          key: fs.readFileSync(httpsKeyPath),
          cert: fs.readFileSync(httpsCertPath),
        }
      : undefined,
    host: "localhost",
    port: 5178,
  },
  resolve: {
    alias: {
      "@components": "/src/components",
      "@pages": "/src/pages",
    },
  },
  optimizeDeps: {
    include: ["three"],
  },
});
