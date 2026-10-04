import { useState } from 'react'
import {
  EditorContent,
  useEditor,
  useEditorState,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import { useNavigate } from 'react-router'

type Document = {
  id: string
  title: string
  content: string
}

type EditorProps = {
  document: Document
}

function Editor({ document }: EditorProps) {
  const navigate = useNavigate()

  const [title, setTitle] = useState(document.title)
  const [saveStatus, setSaveStatus] = useState('Saved')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    content: document.content,
    onUpdate: () => {
      setSaveStatus('Unsaved')
    },
  })

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isBold: false,
          isItalic: false,
          isHeading1: false,
          isBulletList: false,
          canUndo: false,
          canRedo: false,
        }
      }

      return {
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isHeading1: editor.isActive('heading', { level: 1 }),
        isBulletList: editor.isActive('bulletList'),
        canUndo: editor.can().chain().focus().undo().run(),
        canRedo: editor.can().chain().focus().redo().run(),
      }
    },
  })

  const isDocumentEmpty = () => {
    if (!editor) {
      return true
    }

    const titleIsUntouched = title.trim() === 'Untitled Document'

    const contentIsEmpty =
      editor.getText().trim() === ''

    return titleIsUntouched && contentIsEmpty
  }

  const deleteDocument = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this document?',
    )

    if (!confirmed) {
      return
    }

    const response = await fetch(
      `http://localhost:3001/api/documents/${document.id}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      alert('Failed to delete document.')
      return
    }

    navigate('/')
  }

  const goBack = async () => {
    if (isDocumentEmpty()) {
      await fetch(
        `http://localhost:3001/api/documents/${document.id}`,
        {
          method: 'DELETE',
        },
      )
    }

    navigate('/')
  }

  const saveDocument = async () => {
    if (!editor) {
      return
    }

    setSaveStatus('Saving...')

    const response = await fetch(
      `http://localhost:3001/api/documents/${document.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: editor.getHTML(),
        }),
      },
    )

    if (!response.ok) {
      setSaveStatus('Save failed')
      return
    }

    setSaveStatus('Saved')
  }

  if (!editor) {
    return null
  }

  return (
    <div className="editor-shell">
      <div className="editor-toolbar">
        <button
          className="back-button"
          onClick={goBack}
          aria-label="Back to documents"
          title="Back to documents"
        >
          ←
        </button>

        <input
          className="document-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            setSaveStatus('Unsaved')
          }}
        />

        <button onClick={saveDocument}>
          Save
        </button>

        <span className="save-status">
          {saveStatus}
        </span>

        <button
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className={editorState.isBold ? 'active' : ''}
        >
          Bold
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className={editorState.isItalic ? 'active' : ''}
        >
          Italic
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          }
          className={editorState.isHeading1 ? 'active' : ''}
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={editorState.isBulletList ? 'active' : ''}
        >
          Bullet List
        </button>

        <button
          onClick={() =>
            editor.chain().focus().undo().run()
          }
          disabled={!editorState.canUndo}
        >
          Undo
        </button>

        <button
          onClick={() =>
            editor.chain().focus().redo().run()
          }
          disabled={!editorState.canRedo}
        >
          Redo
        </button>

        <button
          className="delete-button"
          onClick={deleteDocument}
        >
          Delete
        </button>
      </div>

      <div className="editor-page">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor
