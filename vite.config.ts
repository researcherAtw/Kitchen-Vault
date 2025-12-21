
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['book.svg', 'chef_2.svg'],
      manifest: {
        name: 'Kitchen Vault',
        short_name: 'KitchenVault',
        description: 'The Black Book of Secret Recipes',
        theme_color: '#5C5C78',
        background_color: '#F9F7EF',
        display: 'standalone',
        scope: './',
        start_url: './',
        orientation: 'portrait',
        icons: [
          {
            src: 'book.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
  }
});
