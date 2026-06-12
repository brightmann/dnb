'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Edit, Calendar, Tag } from 'lucide-react'
import type { AdminPostListItem } from '@/lib/post-summary'

interface PostPickerProps {
  posts: AdminPostListItem[]
}

export function PostPicker({ posts }: PostPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return posts
    }

    return posts.filter((post) => {
      if (post.title.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      if (post.excerpt.toLowerCase().includes(normalizedQuery)) {
        return true
      }

      return post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
    })
  }, [posts, normalizedQuery])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose a Post to Edit</h2>
        <p className="text-muted-foreground mt-2">Select from {posts.length} available posts</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts by title, content, or tags..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {normalizedQuery ? 'No posts match your search' : 'No posts available'}
            </p>
            {!normalizedQuery ? (
              <Button onClick={() => router.push('/admin/posts')}>Create your first post</Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card
              key={post.slug}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => router.push(`/admin/posts/edit/${post.slug}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <Badge variant={post.published ? 'default' : 'secondary'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {post.excerpt ? (
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                ) : null}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString()}
                </div>

                {post.tags.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 ? (
                      <span className="text-xs text-muted-foreground">
                        +{post.tags.length - 3} more
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="pt-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(event) => {
                      event.stopPropagation()
                      router.push(`/admin/posts/edit/${post.slug}`)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
