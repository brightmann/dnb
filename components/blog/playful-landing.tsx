'use client'

import { useMemo, useState, useDeferredValue, useCallback } from 'react'
import { motion } from 'motion/react'
import { SearchBar } from '@/components/blog/search'
import { LandingPost } from '@/components/blog/landing-post'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Filter, ChevronDown } from 'lucide-react'
import type { PostListItem } from '@/lib/post-summary'

const MAX_VISIBLE_TAGS = 5

interface PlayfulLandingProps {
  posts: PostListItem[]
}

export function PlayfulLanding({ posts }: PlayfulLandingProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSet.add(tag)
      }
    }
    return Array.from(tagSet)
  }, [posts])

  const visibleTags = allTags.slice(0, MAX_VISIBLE_TAGS)
  const dropdownTags = allTags.slice(MAX_VISIBLE_TAGS)

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase()

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      if (post.title.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      if (post.excerpt.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      return post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    })
  }, [posts, selectedTag, normalizedQuery])

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag((current) => (current === tag ? null : tag))
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedTag(null)
  }, [])

  const hasActiveFilters = Boolean(searchQuery || selectedTag)

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-20 bottom-0 w-full z-0 pointer-events-none">
        <div className="max-w-4xl mx-auto px-4 relative h-full">
          <div className="absolute left-4 top-0 bottom-0 w-px border-l-2 border-dashed border-muted-foreground/15 pointer-events-none" />
          <div className="absolute right-4 top-0 bottom-0 w-px border-l-2 border-dashed border-muted-foreground/15 pointer-events-none" />
        </div>
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-medium relative"
            >
              Blog
            </motion.h1>

            <ModeToggle />
          </div>
        </div>

        <div className="w-full border-b-2 border-dashed border-muted-foreground/20" />
      </motion.header>

      <section className="py-8 relative z-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-medium mb-4">Simple thoughts, simply shared</h2>
            <p className="text-muted-foreground mb-8">
              A collection of ideas, insights, and experiences
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <SearchBar onSearch={setSearchQuery} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {allTags.length > 0 ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pb-8 relative z-10"
        >
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">Filter by topic</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedTag === null ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className={`rounded-full text-xs border border-border cursor-pointer ${
                  selectedTag === null ? '' : 'hover:bg-muted hover:text-foreground'
                }`}
              >
                All
              </Button>

              {visibleTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Button
                    variant={selectedTag === tag ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleTagSelect(tag)}
                    className={`rounded-full text-xs border border-border cursor-pointer ${
                      selectedTag === tag ? '' : 'hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {tag}
                  </Button>
                </motion.div>
              ))}

              {dropdownTags.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs border border-border cursor-pointer hover:bg-muted hover:text-foreground flex items-center gap-1"
                    >
                      More tags
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    {dropdownTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        className={`cursor-pointer ${
                          selectedTag === tag ? 'bg-primary text-primary-foreground' : ''
                        }`}
                      >
                        {tag}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </div>
        </motion.section>
      ) : null}

      <main className="max-w-2xl mx-auto px-4 pt-8 pb-16 relative z-10">
        {filteredPosts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters ? 'No posts found' : 'No posts yet'}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear filters
              </Button>
            ) : null}
          </motion.div>
        ) : (
          <div className="space-y-12">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                <LandingPost post={post} onTagSelect={handleTagSelect} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
