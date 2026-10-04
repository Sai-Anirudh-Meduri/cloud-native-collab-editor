import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Editor from '../components/Editor'

type Document = {
  id: string
  title: string
  content: string
}

function DocumentPage() {
  const { documentId } = useParams()

  const [document, setDocument] =
    useState<Document | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!documentId) {
      return
    }

    const loadDocument = async () => {
      const response = await fetch(
        `http://localhost:3001/api/documents/${documentId}`,
      )

      if (!response.ok) {
        setLoading(false)
        return
      }

      const data: Document = await response.json()

      setDocument(data)
      setLoading(false)
    }

    loadDocument()
  }, [documentId])

  if (loading) {
    return <p>Loading document...</p>
  }

  if (!document) {
    return <p>Document not found.</p>
  }

  return <Editor document={document} />
}

export default DocumentPage
