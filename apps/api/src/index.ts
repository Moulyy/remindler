import { buildServer } from "./server"

const server = buildServer()
const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? "127.0.0.1"

await server.listen({ port, host })
