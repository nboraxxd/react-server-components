import { Spinner } from '@/components/spinner'

export default function Loading() {
  return (
    <div className="bg-gray-50 flex justify-center items-center min-h-screen">
      <Spinner className="size-8 animate-spin" />
    </div>
  )
}
