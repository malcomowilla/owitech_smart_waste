import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const FALLBACK_TARGET = 'http://0.0.0.0:3000'

// Choose the backend from the host the browser used
const pickTarget = (req) => {
  // strip the port, e.g. "shop.owitech.co.ke:5173" -> "shop.owitech.co.ke"
  const host = (req.headers.host || '').split(':')[0]

  if (
    host === 'aitechs.co.ke' ||
    host.endsWith('.aitechs.co.ke') ||
    host.endsWith('.owitech.co.ke')
  ) {
    return `https://${host}`
  }

  return FALLBACK_TARGET
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      '/api': {
        target: FALLBACK_TARGET, // must be a string
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          const web = proxy.web.bind(proxy)
          proxy.web = (req, res, opts, cb) =>
            web(req, res, { ...opts, target: pickTarget(req) }, cb)
        },
      },
    },
  },
})