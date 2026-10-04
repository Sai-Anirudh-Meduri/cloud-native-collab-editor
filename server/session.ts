import type { Request } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from './auth'

export async function getSession(req: Request) {
  return auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
}
