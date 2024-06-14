import Link from 'next/link'
import type { Url } from 'next/dist/shared/lib/router/router'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

import { cn } from '@/utils'
import { prisma } from '@/lib/prisma'
import { SearchParamsProps } from '@/types'
import { SearchInput } from '@/app/search-input'

type User = {
  id: number
  name: string
  email: string
}

interface PaginationLinkProps {
  children: React.ReactNode
  href?: Url
  disabled?: boolean
}

const PAGE_SIZE = 7

export default async function Users({ searchParams }: SearchParamsProps) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''

  const totalUsers = await prisma.user.count({ where: { name: { contains: search } } })
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE)

  const page = typeof searchParams.page === 'string' ? Math.max(1, Math.min(+searchParams.page, totalPages)) : 1

  const users: User[] = await prisma.user.findMany({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    where: { name: { contains: search } },
  })

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
          <PaginationLink href={page > 2 ? `/?page=${page - 1}` : page === 1 ? undefined : '/'} disabled={page === 1}>
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
          <PaginationLink href={page < totalPages ? `/?page=${page + 1}` : undefined} disabled={page === totalPages}>
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </div>
      </div>
    </div>
  )
}

function PaginationLink({ children, href, disabled }: PaginationLinkProps) {
  const paginationClassName = cn(
    'shadow bg-white border border-gray-300 px-2 py-1.5 inline-flex items-center justify-center text-sm text-gray-900 font-semibold rounded-md hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors',
    { 'pointer-events-none opacity-50': disabled }
  )

  return href ? (
    <Link href={href} className={paginationClassName}>
      {children}
    </Link>
  ) : (
    <span className={paginationClassName}>{children}</span>
  )
}
