'use client'

import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Spinner } from '@/components/spinner'
import useDebounce from '@/hooks/useDebounce'

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  const debouncedSearchText = useDebounce(searchText, 500)

  const handleSearchInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchText(ev.target.value)
  }

  useEffect(() => {
    const trimmedValue = debouncedSearchText.trim()

    const searchParams = new URLSearchParams()
    trimmedValue !== '' ? searchParams.set('search', trimmedValue) : searchParams.delete('search')

    startTransition(() => {
      router.push(`/?${searchParams}`)
    })
  }, [debouncedSearchText, router])

  return (
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full rounded-md border-gray-300 pl-10 focus:ring-0 focus:border-gray-400 focus:outline-none text-sm"
        placeholder="Search"
        value={searchText}
        onChange={handleSearchInputChange}
      />
      {isPending ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Spinner className="size-5 animate-spin text-gray-400" aria-hidden="true" />
        </div>
      ) : null}
    </div>
  )
}
