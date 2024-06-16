import Link from 'next/link'
import { Suspense } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

import { prisma } from '@/lib/prisma'
import { SearchParamsProps } from '@/types'
import { SearchInput } from '@/app/search-input'
import { Spinner } from '@/components/spinner'

type User = {
  id: number
  name: string
  email: string
}

interface PaginationLinkProps {
  children: React.ReactNode
  currentSearchParams: URLSearchParams
  direction: 'previous' | 'next'
  page: number
  totalPages: number
}

const PAGE_SIZE = 7

export default async function Page({ searchParams }: SearchParamsProps) {
  return (
    <div className="px-8 bg-gray-50 pt-12 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="w-80">
          <SearchInput />
        </div>
        <div className="mt-0 ml-8 flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>

      {/* User table */}
      <Suspense fallback={<Loading />}>
        <UserTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function Loading() {
  return (
    <div className="mt-8 flex justify-center items-center">
      <Spinner className="size-8 animate-spin" />
    </div>
  )
}

async function UserTable({ searchParams }: SearchParamsProps) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  const totalUsers = await prisma.user.count({ where: { name: { contains: search } } })
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE)

  const page = typeof searchParams.page === 'string' ? Math.max(1, Math.min(+searchParams.page, totalPages)) : 1

  const users: User[] = await prisma.user.findMany({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    where: { name: { contains: search } },
  })

  const currentSearchParams = new URLSearchParams()
  if (search) {
    currentSearchParams.set('search', search)
  }

  return (
    <div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6">
          <div className="inline-block min-w-full py-2 align-middle px-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pr-3 text-left text-sm font-semibold w-[62px] sm:w-auto text-gray-900 pl-4">
                      ID
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold w-[130px] sm:w-auto text-gray-900">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold w-[175px] sm:w-auto text-gray-900">
                      Email
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 pl-4">{user.id}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium max-w-[130px] sm:w-auto truncate">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-[175px] sm:w-auto truncate">
                        {user.email}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-4 pr-4 text-right text-sm font-medium">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                          Edit
                          <ChevronRightIcon className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
        <p className="text-sm text-gray-700">
          Showing <span className="font-semibold">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
          <span className="font-semibold">{Math.min(page * PAGE_SIZE, totalUsers)}</span> of{' '}
          <span className="font-semibold">{totalUsers}</span> users
        </p>
        <div className="sm:mr-3 space-x-2 max-sm:self-end">
          <PaginationLink
            direction="previous"
            page={page}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          >
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
          <PaginationLink
            direction="next"
            page={page}
            totalPages={totalPages}
            currentSearchParams={currentSearchParams}
          >
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </div>
      </div>
    </div>
  )
}

function PaginationLink({ children, currentSearchParams, page, direction, totalPages }: PaginationLinkProps) {
  const newSearchParams = new URLSearchParams(currentSearchParams)

  if (direction === 'previous') {
    if (page > 2) {
      newSearchParams.set('page', String(page - 1))
    } else {
      newSearchParams.delete('page')
    }
  }

  if (direction === 'next') {
    if (page < totalPages) {
      newSearchParams.set('page', String(page + 1))
    } else {
      newSearchParams.set('page', String(totalPages))
    }
  }

  const isAtEdgePage = (direction === 'previous' && page === 1) || (direction === 'next' && page === totalPages)

  const paginationClassName =
    'shadow bg-white border border-gray-300 px-2 py-1.5 inline-flex items-center justify-center text-sm text-gray-900 font-semibold rounded-md hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:pointer-events-none disabled:opacity-50'

  return !isAtEdgePage ? (
    <Link href={`/?${newSearchParams}`} className={paginationClassName}>
      {children}
    </Link>
  ) : (
    <button className={paginationClassName} disabled={isAtEdgePage}>
      {children}
    </button>
  )
}
