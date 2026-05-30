import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { updateProduct } from '@/lib/actions/products'
import ProductForm from '../../ProductForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const [product] = await db.select().from(products).where(eq(products.id, parseInt(id)))
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm action={updateProduct.bind(null, product.id)} defaultValues={product} />
    </div>
  )
}
