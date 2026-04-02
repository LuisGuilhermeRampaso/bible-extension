import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFileSync, mkdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function copyManifestPlugin() {
  return {
    name: 'copy-manifest',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist');
      mkdirSync(outDir, { recursive: true });
      copyFileSync(resolve(__dirname, 'manifest.json'), resolve(outDir, 'manifest.json'));
    },
  } as const;
}

export default defineConfig({
  plugins: [copyManifestPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
