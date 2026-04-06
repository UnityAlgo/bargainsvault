import { createBlog } from '@/lib/actions/blogs'
import BlogForm from '../BlogForm'

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Blog Post</h1>
      <BlogForm action={createBlog} />
    </div>
  )
}
