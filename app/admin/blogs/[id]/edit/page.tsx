import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { blogs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { updateBlog } from '@/lib/actions/blogs'
import BlogForm from '../../BlogForm'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, parseInt(id))).limit(1)

  if (!blog) notFound()

  const action = updateBlog.bind(null, blog.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
      <BlogForm action={action} defaultValues={blog} />
    </div>
  )
}
