'use client'

import { useState } from 'react'

type Props = {
  label?: string
  defaultValue?: string | null
  required?: boolean
  /** Prefix for form field names. Defaults to 'image' → fields: imageUrl / imageFile */
  fieldPrefix?: string
}

export default function ImageUploadInput({
  label = 'Image',
  defaultValue,
  required = false,
  fieldPrefix = 'image',
}: Props) {
  const urlFieldName = `${fieldPrefix}Url`
  const fileFieldName = `${fieldPrefix}File`
  const [mode, setMode] = useState<'url' | 'file'>('url')
  const [urlValue, setUrlValue] = useState(defaultValue ?? '')
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) { setPreview(null); return }
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleUrlBlur(e: React.FocusEvent<HTMLInputElement>) {
    setPreview(e.target.value || null)
  }

  function switchMode(next: 'url' | 'file') {
    setMode(next)
    setPreview(next === 'url' ? urlValue || null : null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {/* Toggle */}
      <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden mb-3">
        <button
          type="button"
          onClick={() => switchMode('url')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === 'url'
              ? 'bg-purple-700 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => switchMode('file')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === 'file'
              ? 'bg-purple-700 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Upload File
        </button>
      </div>

      {mode === 'url' ? (
        <input
          name={urlFieldName}
          type="url"
          value={urlValue}
          required={required}
          onChange={e => setUrlValue(e.target.value)}
          onBlur={handleUrlBlur}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="https://example.com/image.png"
        />
      ) : (
        <>
          {/* Clear the URL field so the action uses the file */}
          <input name={urlFieldName} type="hidden" value="" />
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors bg-gray-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400 mb-1">
              <path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16.8A4 4 0 0 1 4 9a4.5 4.5 0 0 1 8.4-2A4 4 0 1 1 18 12.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-gray-500">Click to choose a file</span>
            <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WebP, SVG</span>
            <input
              name={fileFieldName}
              type="file"
              accept="image/*"
              required={required}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </>
      )}

      {/* Live preview */}
      {preview && (
        <div className="mt-3 flex items-center gap-3">
          <img
            src={preview}
            alt="Preview"
            className="h-16 w-auto max-w-[120px] rounded-lg border border-gray-200 object-contain bg-gray-50 p-1"
          />
          <span className="text-xs text-gray-400">Preview</span>
        </div>
      )}
    </div>
  )
}
