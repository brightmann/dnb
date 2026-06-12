'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('')
  const [, startTransition] = useTransition()

  const handleChange = (value: string) => {
    setQuery(value)
    startTransition(() => {
      onSearch(value)
    })
  }

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="relative max-w-md mx-auto"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        className="pl-10 border-0 bg-muted/50 focus-visible:ring-1"
      />
    </form>
  )
}
