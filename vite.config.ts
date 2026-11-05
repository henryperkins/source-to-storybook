// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { loadEnv, type Plugin } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Server routes need non-VITE_ env vars (e.g. SUPABASE_SERVICE_ROLE_KEY,
// LOVABLE_API_KEY). The base config only injects VITE_* vars for client code;
// this plugin additionally populates process.env for server-side code only.
// Never add these keys to an envDefine block — that would leak secrets into
// the client bundle.
const loadServerEnv: Plugin = {
  name: "load-server-env",
  config(_config, { mode }) {
    const serverEnv = loadEnv(mode, process.cwd(), "");
    Object.assign(process.env, serverEnv);
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [loadServerEnv],
    resolve: {
      alias: {
        // Pin entities deep imports and root to the hoisted v4.5.0 copy; a
        // nested v7 copy breaks SSR (it removed ./lib/decode.js).
        "entities/lib/decode.js": path.resolve(__dirname, "node_modules/entities/lib/decode.js"),
        "entities/lib/encode.js": path.resolve(__dirname, "node_modules/entities/lib/encode.js"),
        entities: path.resolve(__dirname, "node_modules/entities"),
      },
    },
  },
});
