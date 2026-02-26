import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin to make CSS non-render-blocking (loads async, applies when ready)
function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      // Transform: <link rel="stylesheet" href="...css">
      // Into: <link rel="stylesheet" href="...css" media="print" onload="this.media='all'">
      // This makes CSS load without blocking render (critical CSS is already inlined)
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'">' +
        '<noscript><link rel="stylesheet" href="$1"></noscript>'
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && asyncCssPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable CSS code splitting for better performance
    cssCodeSplit: true,
    // Increase chunk size warning limit (we're already chunking appropriately)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React vendor chunk
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // TanStack Query chunk
          "vendor-query": ["@tanstack/react-query"],
          // UI library chunk (only Radix primitives needed on homepage)
          // Dialog, dropdown-menu, label, select are used only in lazy routes
          // and will be automatically bundled with those routes by Vite
          "vendor-ui": [
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
          ],
          // Sanity client chunk
          "vendor-sanity": ["@sanity/client", "@sanity/image-url"],
        },
      },
    },
  },
}));
