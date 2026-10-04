import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth'
import { pool } from './database'
import { getSession } from './session'

const app = express()
const PORT = 3001

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)
app.all('/api/auth/*splat', toNodeHandler(auth))
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    service: 'cloud-native-collab-editor',
    status: 'running',
  })
})

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'collab-editor-server',
  })
})

app.get('/api/documents', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, content, created_at, updated_at
      FROM documents
      ORDER BY updated_at DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch documents:', error)

    res.status(500).json({
      error: 'Failed to fetch documents',
    })
  }
})

app.get('/api/documents/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT id, title, content, created_at, updated_at
        FROM documents
        WHERE id = $1
      `,
      [req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Document not found',
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to fetch document:', error)

    res.status(500).json({
      error: 'Failed to fetch document',
    })
  }
})

app.post('/api/documents', async (req, res) => {
  try {
    const id = crypto.randomUUID()
    const title = req.body.title ?? 'Untitled Document'
    const content = req.body.content ?? ''

    const result = await pool.query(
      `
        INSERT INTO documents (id, title, content)
        VALUES ($1, $2, $3)
        RETURNING id, title, content, created_at, updated_at
      `,
      [id, title, content],
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Failed to create document:', error)

    res.status(500).json({
      error: 'Failed to create document',
    })
  }
})

app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, content } = req.body

    const result = await pool.query(
      `
        UPDATE documents
        SET
          title = COALESCE($1, title),
          content = COALESCE($2, content),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, title, content, created_at, updated_at
      `,
      [title, content, req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Document not found',
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Failed to update document:', error)

    res.status(500).json({
      error: 'Failed to update document',
    })
  }
})

app.delete('/api/documents/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `
        DELETE FROM documents
        WHERE id = $1
        RETURNING id
      `,
      [req.params.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Document not found',
      })
    }

    res.status(204).send()
  } catch (error) {
    console.error('Failed to delete document:', error)

    res.status(500).json({
      error: 'Failed to delete document',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

app.get('/api/me', async (req, res) => {
  const session = await getSession(req)

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized',
    })
  }

  res.json({
    user: session.user,
  })
})
