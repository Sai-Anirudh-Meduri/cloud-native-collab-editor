import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

type Document = {
  id: string
  title: string
  content: string
}

function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([])
  const navigate = useNavigate()

  const loadDocuments = async () => {
    const response = await fetch('http://localhost:3001/api/documents')
    const data: Document[] = await response.json()

    setDocuments(data)
  }

  const createDocument = async () => {
    const response = await fetch('http://localhost:3001/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Untitled Document',
        content: '',
      }),
    })

    const document: Document = await response.json()

    navigate(`/documents/${document.id}`)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1>Documents</h1>

        <button onClick={createDocument}>
          New Document
        </button>
      </div>

      <div className="document-list">
        {documents.map((document) => (
          <button
            key={document.id}
            className="document-card"
            onClick={() => navigate(`/documents/${document.id}`)}
          >
            <strong>{document.title}</strong>
          </button>
        ))}
      </div>
    </main>
  )
}

export default Dashboard
