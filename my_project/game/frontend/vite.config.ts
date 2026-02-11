import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    allowedHosts: [
      '.loca.lt',
      '10.13.249.23'
    ]
  }
})
