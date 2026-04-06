'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({
  action,
  label = 'Delete',
}: {
  action: () => Promise<void>
  label?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm('Are you sure you want to delete this?')) return
    startTransition(async () => {
      await action()
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isPending ? 'Deleting…' : label}
    </button>
  )
}
