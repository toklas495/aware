import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 3000,
    strictPort: true,
  },

  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Ensure images in public folder are not compressed
    assetsInlineLimit: 0, // Don't inline small assets, keep as files
  },
  
  // Optimize image handling - no compression for logo files
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.ico'],
});
