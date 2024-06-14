'use client'

import { ChangeEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  const handleSearchInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value.trim() === '') {
      router.push('/')
      setSearchText(ev.target.value)
      return
    }

    router.push(`/?search=${ev.target.value.trim()}`)
    setSearchText(ev.target.value)
  }
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
    </div>
  )
}
