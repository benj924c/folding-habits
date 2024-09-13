// adapters/vercel-edge/vite.config.ts
import { vercelEdgeAdapter } from "file:///Users/benjaminrenschvinterberg/Side-Projects/foldy/node_modules/.pnpm/@builder.io+qwik-city@1.8.0_@types+node@22.5.4_rollup@4.21.3/node_modules/@builder.io/qwik-city/lib/adapters/vercel-edge/vite/index.mjs";
import { extendConfig } from "file:///Users/benjaminrenschvinterberg/Side-Projects/foldy/node_modules/.pnpm/@builder.io+qwik-city@1.8.0_@types+node@22.5.4_rollup@4.21.3/node_modules/@builder.io/qwik-city/lib/vite/index.mjs";

// vite.config.ts
import { defineConfig } from "file:///Users/benjaminrenschvinterberg/Side-Projects/foldy/node_modules/.pnpm/vite@5.4.4_@types+node@22.5.4/node_modules/vite/dist/node/index.js";
import { qwikVite } from "file:///Users/benjaminrenschvinterberg/Side-Projects/foldy/node_modules/.pnpm/@builder.io+qwik@1.8.0_@types+node@22.5.4/node_modules/@builder.io/qwik/dist/optimizer.mjs";
import { qwikCity } from "file:///Users/benjaminrenschvinterberg/Side-Projects/foldy/node_modules/.pnpm/@builder.io+qwik-city@1.8.0_@types+node@22.5.4_rollup@4.21.3/node_modules/@builder.io/qwik-city/lib/vite/index.mjs";
import tsconfigPaths from "file:///Users/benjaminrenschvinterberg/Side-Projects/foldy/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.6.2_vite@5.4.4_@types+node@22.5.4_/node_modules/vite-tsconfig-paths/dist/index.js";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600"
      }
    }
  };
});

// adapters/vercel-edge/vite.config.ts
var vite_config_default2 = extendConfig(vite_config_default, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.vercel-edge.tsx", "@qwik-city-plan"]
      },
      outDir: ".vercel/output/functions/_qwik-city.func"
    },
    plugins: [vercelEdgeAdapter()]
  };
});
export {
  vite_config_default2 as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYWRhcHRlcnMvdmVyY2VsLWVkZ2Uvdml0ZS5jb25maWcudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYmVuamFtaW5yZW5zY2h2aW50ZXJiZXJnL1NpZGUtUHJvamVjdHMvZm9sZHkvYWRhcHRlcnMvdmVyY2VsLWVkZ2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9iZW5qYW1pbnJlbnNjaHZpbnRlcmJlcmcvU2lkZS1Qcm9qZWN0cy9mb2xkeS9hZGFwdGVycy92ZXJjZWwtZWRnZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYmVuamFtaW5yZW5zY2h2aW50ZXJiZXJnL1NpZGUtUHJvamVjdHMvZm9sZHkvYWRhcHRlcnMvdmVyY2VsLWVkZ2Uvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2ZXJjZWxFZGdlQWRhcHRlciB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrLWNpdHkvYWRhcHRlcnMvdmVyY2VsLWVkZ2Uvdml0ZVwiO1xuaW1wb3J0IHsgZXh0ZW5kQ29uZmlnIH0gZnJvbSBcIkBidWlsZGVyLmlvL3F3aWstY2l0eS92aXRlXCI7XG5pbXBvcnQgYmFzZUNvbmZpZyBmcm9tIFwiLi4vLi4vdml0ZS5jb25maWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgZXh0ZW5kQ29uZmlnKGJhc2VDb25maWcsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBidWlsZDoge1xuICAgICAgc3NyOiB0cnVlLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDogW1wic3JjL2VudHJ5LnZlcmNlbC1lZGdlLnRzeFwiLCBcIkBxd2lrLWNpdHktcGxhblwiXSxcbiAgICAgIH0sXG4gICAgICBvdXREaXI6IFwiLnZlcmNlbC9vdXRwdXQvZnVuY3Rpb25zL19xd2lrLWNpdHkuZnVuY1wiLFxuICAgIH0sXG4gICAgcGx1Z2luczogW3ZlcmNlbEVkZ2VBZGFwdGVyKCldLFxuICB9O1xufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9iZW5qYW1pbnJlbnNjaHZpbnRlcmJlcmcvU2lkZS1Qcm9qZWN0cy9mb2xkeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2JlbmphbWlucmVuc2NodmludGVyYmVyZy9TaWRlLVByb2plY3RzL2ZvbGR5L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9iZW5qYW1pbnJlbnNjaHZpbnRlcmJlcmcvU2lkZS1Qcm9qZWN0cy9mb2xkeS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBxd2lrVml0ZSB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrL29wdGltaXplclwiO1xuaW1wb3J0IHsgcXdpa0NpdHkgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay1jaXR5L3ZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3F3aWtDaXR5KCksIHF3aWtWaXRlKCksIHRzY29uZmlnUGF0aHMoKV0sXG4gICAgcHJldmlldzoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNhY2hlLUNvbnRyb2xcIjogXCJwdWJsaWMsIG1heC1hZ2U9NjAwXCIsXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFksU0FBUyx5QkFBeUI7QUFDNWEsU0FBUyxvQkFBb0I7OztBQ0Q4UyxTQUFTLG9CQUFvQjtBQUN4VyxTQUFTLGdCQUFnQjtBQUN6QixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUNoQyxTQUFPO0FBQUEsSUFDTCxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxjQUFjLENBQUM7QUFBQSxJQUNqRCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxpQkFBaUI7QUFBQSxNQUNuQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzs7O0FEVkQsSUFBT0EsdUJBQVEsYUFBYSxxQkFBWSxNQUFNO0FBQzVDLFNBQU87QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLGVBQWU7QUFBQSxRQUNiLE9BQU8sQ0FBQyw2QkFBNkIsaUJBQWlCO0FBQUEsTUFDeEQ7QUFBQSxNQUNBLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxTQUFTLENBQUMsa0JBQWtCLENBQUM7QUFBQSxFQUMvQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInZpdGVfY29uZmlnX2RlZmF1bHQiXQp9Cg==
