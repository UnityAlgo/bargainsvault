import { createProduct } from '@/lib/actions/products'
import ProductForm from '../ProductForm'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Product</h1>
      <ProductForm action={createProduct} />
    </div>
  )
}
