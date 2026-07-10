import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function saveUploadedFile(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true })
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  await writeFile(path.join(UPLOAD_DIR, filename), buffer)
  return `/uploads/${filename}`
}

export async function resolveImageUrl(formData: FormData): Promise<string | null> {
  return resolveNamedImageUrl(formData, '')
}

export async function resolveNamedImageUrl(formData: FormData, prefix: string): Promise<string | null> {
  const fileKey = prefix ? `${prefix}File` : 'imageFile'
  const urlKey = prefix ? `${prefix}Url` : 'imageUrl'
  const file = formData.get(fileKey) as File | null
  if (file && file.size > 0) {
    return saveUploadedFile(file)
  }
  const url = formData.get(urlKey) as string
  return url || null
}
