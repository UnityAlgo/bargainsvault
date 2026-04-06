import { createStore } from '@/lib/actions/stores'
import StoreForm from '../StoreForm'

export default function NewStorePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Store</h1>
      <StoreForm action={createStore} />
    </div>
  )
}
