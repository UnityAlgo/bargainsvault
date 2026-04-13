'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  defaultValue?: string
  onChange: (html: string) => void
}

// ─── Toolbar button ────────────────────────────────────────────────────────

function ToolBtn({
  onClick,
  active,
  title,
  children,
  danger,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={[
        'flex items-center justify-center w-7 h-7 rounded text-xs transition-colors',
        active
          ? 'bg-purple-700 text-white'
          : danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-600 hover:bg-purple-50 hover:text-purple-800',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />
}

// ─── Main editor ──────────────────────────────────────────────────────────

export default function TipTapEditor({ defaultValue = '', onChange }: Props) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: 'rounded-lg bg-gray-900 text-gray-100 p-4 text-sm font-mono overflow-x-auto' } },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-purple-700 underline hover:text-purple-900' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg my-4' } }),
      Placeholder.configure({ placeholder: 'Start writing your blog post…' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultValue,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-purple max-w-none min-h-[420px] p-4 focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  // Keep defaultValue in sync when editing an existing post
  useEffect(() => {
    if (editor && defaultValue && editor.isEmpty) {
      editor.commands.setContent(defaultValue)
    }
  }, [editor, defaultValue])

  const insertLink = useCallback(() => {
    if (!editor || !linkUrl.trim()) return
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setLinkUrl('')
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return
    editor.chain().focus().setImage({ src: imageUrl }).run()
    setImageUrl('')
    setShowImageInput(false)
  }, [editor, imageUrl])

  const insertTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">

        {/* Headings */}
        <select
          onChange={e => {
            const v = e.target.value
            if (v === 'p') editor.chain().focus().setParagraph().run()
            else editor.chain().focus().toggleHeading({ level: parseInt(v) as 1|2|3|4 }).run()
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            editor.isActive('heading', { level: 4 }) ? '4' : 'p'
          }
          className="h-7 px-1.5 text-xs border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="p">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <Divider />

        {/* Text format */}
        <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
          <em>I</em>
        </ToolBtn>
        <ToolBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline (Ctrl+U)">
          <span className="underline">U</span>
        </ToolBtn>
        <ToolBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
          <span className="line-through">S</span>
        </ToolBtn>
        <ToolBtn active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code">
          {'</>'}
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left">
          ≡
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align center">
          ☰
        </ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right">
          ≣
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
          •≡
        </ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
          1≡
        </ToolBtn>
        <ToolBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
          ❝
        </ToolBtn>
        <ToolBtn active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block">
          {'{ }'}
        </ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn active={editor.isActive('link') || showLinkInput} onClick={() => { setShowLinkInput(s => !s); setShowImageInput(false) }} title="Insert link">
          🔗
        </ToolBtn>

        {/* Unlink */}
        {editor.isActive('link') && (
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link" danger>
            ✂
          </ToolBtn>
        )}

        {/* Image */}
        <ToolBtn active={showImageInput} onClick={() => { setShowImageInput(s => !s); setShowLinkInput(false) }} title="Insert image">
          🖼
        </ToolBtn>

        {/* Table */}
        <ToolBtn onClick={insertTable} title="Insert 3×3 table" active={editor.isActive('table')}>
          ⊞
        </ToolBtn>
        {editor.isActive('table') && (
          <>
            <ToolBtn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add column">+col</ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().addRowAfter().run()} title="Add row">+row</ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().deleteTable().run()} title="Delete table" danger>✕tbl</ToolBtn>
          </>
        )}

        <Divider />

        {/* Horizontal rule */}
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
          —
        </ToolBtn>

        <Divider />

        {/* Undo / Redo */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)" active={false}>
          ↩
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)" active={false}>
          ↪
        </ToolBtn>

        {/* Text color */}
        <Divider />
        <label title="Text color" className="flex items-center justify-center w-7 h-7 rounded hover:bg-purple-50 cursor-pointer">
          <span className="text-xs font-bold" style={{ color: editor.getAttributes('textStyle').color || '#1c1028' }}>A</span>
          <input
            type="color"
            className="sr-only"
            value={editor.getAttributes('textStyle').color || '#1c1028'}
            onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        <ToolBtn onClick={() => editor.chain().focus().unsetColor().run()} title="Clear color">
          ✕A
        </ToolBtn>
      </div>

      {/* ── Link input ── */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border-b border-purple-100">
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); insertLink() } }}
            className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            autoFocus
          />
          <button type="button" onClick={insertLink} className="px-3 py-1.5 text-xs font-semibold bg-purple-700 text-white rounded-md hover:bg-purple-800">
            Insert
          </button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-800">
            Cancel
          </button>
        </div>
      )}

      {/* ── Image input ── */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border-b border-purple-100">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); insertImage() } }}
            className="flex-1 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            autoFocus
          />
          <button type="button" onClick={insertImage} className="px-3 py-1.5 text-xs font-semibold bg-purple-700 text-white rounded-md hover:bg-purple-800">
            Insert
          </button>
          <button type="button" onClick={() => setShowImageInput(false)} className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-800">
            Cancel
          </button>
        </div>
      )}

      {/* ── Editor area ── */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* ── Word count ── */}
      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200 text-right text-xs text-gray-400">
        {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words
      </div>
    </div>
  )
}
