'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import type { AdminPostListItem } from '@/lib/post-summary'

interface PostsManagerProps {
  posts: AdminPostListItem[]
}

export function PostsManager({ posts: initialPosts }: PostsManagerProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isCreating, startCreateTransition] = useTransition()
  const [deletingSlug, startDeleteTransition] = useTransition()
  const router = useRouter()

  const createPost = () => {
    const title = newPostTitle.trim()
    if (!title) {
      return
    }

    startCreateTransition(async () => {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        })

        const data = await response.json()
        if (response.ok) {
          setShowCreateDialog(false)
          setNewPostTitle('')
          router.push(`/admin/posts/edit/${data.slug}`)
        }
      } catch (error) {
        console.error('Failed to create post:', error)
      }
    })
  }

  const deletePost = (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    startDeleteTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setPosts((current) => current.filter((post) => post.slug !== slug))
        }
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} posts</p>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <Plus className="h-3 w-3 mr-1" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter post title..."
                value={newPostTitle}
                onChange={(event) => setNewPostTitle(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && createPost()}
                className="h-8"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={createPost}
                  disabled={isCreating || !newPostTitle.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-3">No posts yet</p>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            Create your first post
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between py-3 px-3 rounded-md border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  <Badge
                    variant={post.published ? 'default' : 'secondary'}
                    className="text-xs h-4"
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  {post.tags.length > 0 ? (
                    <>
                      <span>•</span>
                      <span>{post.tags.join(', ')}</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-1 ml-3">
                {post.published ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    className="h-7 w-7 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                ) : null}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/posts/edit/${post.slug}`)}
                  className="h-7 w-7 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePost(post.slug)}
                  disabled={deletingSlug}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
