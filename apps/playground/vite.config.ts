import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@aibyters/charts-bi': path.resolve(__dirname, '../../packages/charts-bi/src/index.ts'),
      '@aibyters/charts-ds': path.resolve(__dirname, '../../packages/charts-ds/src/index.ts'),
      '@aibyters/charts-kpi': path.resolve(__dirname, '../../packages/charts-kpi/src/index.ts'),
      '@aibyters/charts-ai': path.resolve(__dirname, '../../packages/charts-ai/src/index.ts'),
      '@aibyters/charts-geo': path.resolve(__dirname, '../../packages/charts-geo/src/index.ts'),
      '@aibyters/charts-network': path.resolve(__dirname, '../../packages/charts-network/src/index.ts'),
      '@aibyters/charts-flow': path.resolve(__dirname, '../../packages/charts-flow/src/index.ts'),
      '@aibyters/charts-infographics': path.resolve(__dirname, '../../packages/charts-infographics/src/index.ts'),
      '@aibyters/layout': path.resolve(__dirname, '../../packages/layout/src/index.ts'),
      '@aibyters/spec': path.resolve(__dirname, '../../packages/spec/src/index.ts'),
      '@aibyters/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@aibyters/svg': path.resolve(__dirname, '../../packages/svg/src/index.ts'),
      '@aibyters/theme': path.resolve(__dirname, '../../packages/theme/src/index.ts'),
      '@aibyters/tokens': path.resolve(__dirname, '../../packages/tokens/src/index.ts'),
    },
    dedupe: ['react', 'react-dom', 'recharts']
  },
  server: {
    port: 5173
  }
})
