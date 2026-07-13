import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { blogs, blogCategories } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { updateBlog } from '@/lib/actions/blogs'
import BlogForm from '../../BlogForm'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [[blog], categories] = await Promise.all([
    db.select().from(blogs).where(eq(blogs.id, parseInt(id))).limit(1),
    db.select().from(blogCategories).orderBy(asc(blogCategories.name)),
  ])

  if (!blog) notFound()

  const action = updateBlog.bind(null, blog.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
      <BlogForm action={action} defaultValues={blog} categories={categories} />
    </div>
  )
}
