import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isLovableSandbox =
  process.env.LOVABLE_SANDBOX === "1" || Boolean(process.env.DEV_SERVER__PROJECT_PATH);

export default defineConfig((env) => {
  if (isLovableSandbox) {
    // Keep Lovable's preview bridge and its existing Nitro-based build path in the sandbox.
    return defineLovableConfig({
      tanstackStart: { server: { entry: "server" } },
    })(env);
  }

  // Cloudflare's adapter must precede TanStack Start; do not register Nitro in this mode.
  return {
    plugins: [
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tanstackStart({ server: { entry: "server" } }),
      react(),
      tailwindcss(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
    ],
  };
});
