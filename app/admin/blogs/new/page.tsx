import { db } from '@/lib/db'
import { blogCategories } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { createBlog } from '@/lib/actions/blogs'
import BlogForm from '../BlogForm'

export default async function NewBlogPage() {
  const categories = await db.select().from(blogCategories).orderBy(asc(blogCategories.name))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Blog Post</h1>
      <BlogForm action={createBlog} categories={categories} />
    </div>
  )
}
