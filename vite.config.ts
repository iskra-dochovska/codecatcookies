import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Runs api/*.ts handlers in-process during `vite dev`, so plain `npm run dev`
// exercises the real handlers without needing `vercel dev`.
const API_ROUTE_PATTERN = /^\/[a-zA-Z0-9_-]+$/

function localApiPlugin(): Plugin {
  return {
    name: 'local-api-dev',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const pathname = (req.url ?? '/').split('?')[0]
        if (!API_ROUTE_PATTERN.test(pathname)) {
          next()
          return
        }
        const modulePath = `/api${pathname}.ts`

        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const bodyText = Buffer.concat(chunks).toString('utf-8')

        const vercelReq = req as typeof req & { body: unknown }
        try {
          vercelReq.body = bodyText ? JSON.parse(bodyText) : {}
        } catch {
          vercelReq.body = {}
        }

        type ResWithHelpers = typeof res & {
          status: (code: number) => ResWithHelpers
          json: (payload: unknown) => void
        }
        const vercelRes = res as ResWithHelpers
        vercelRes.status = (code) => {
          res.statusCode = code
          return vercelRes
        }
        vercelRes.json = (payload) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }

        try {
          const mod = await server.ssrLoadModule(modulePath)
          await mod.default(vercelReq, vercelRes)
        } catch (error) {
          console.error(`[local-api-dev] ${modulePath} threw:`, error)
          if (!res.headersSent) vercelRes.status(500).json({ error: 'Local API handler crashed' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), localApiPlugin()],
  }
})
