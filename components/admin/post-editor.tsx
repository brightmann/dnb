'use client'

import { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Save, Eye, X, FileText, Monitor } from 'lucide-react'
import type { PostFrontMatter } from '@/lib/posts'

const MDXContent = dynamic(
  () => import('@/components/blog/mdx-content').then((module) => module.MDXContent),
  {
    loading: () => <p className="text-muted-foreground italic">Loading preview...</p>,
  }
)

interface PostEditorProps {
  slug: string
  initialFrontMatter: PostFrontMatter
  initialContent: string
}

export function PostEditor({ slug, initialFrontMatter, initialContent }: PostEditorProps) {
  const [frontMatter, setFrontMatter] = useState(initialFrontMatter)
  const [content, setContent] = useState(initialContent)
  const [newTag, setNewTag] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, startSaveTransition] = useTransition()
  const router = useRouter()

  const savePost = () => {
    startSaveTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frontMatter: {
              ...frontMatter,
              date: new Date().toISOString(),
            },
            content,
          }),
        })

        if (response.ok) {
          router.push('/admin/posts')
          router.refresh()
        }
      } catch (error) {
        console.error('Failed to save post:', error)
      }
    })
  }

  const addTag = () => {
    const tag = newTag.trim()
    if (!tag || frontMatter.tags.includes(tag)) {
      return
    }

    setFrontMatter((previous) => ({
      ...previous,
      tags: [...previous.tags, tag],
    }))
    setNewTag('')
  }

  const removeTag = (tagToRemove: string) => {
    setFrontMatter((previous) => ({
      ...previous,
      tags: previous.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{frontMatter.title || 'New Post'}</h2>
          <p className="text-muted-foreground">Slug: {slug}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/posts')}>
            Cancel
          </Button>

          {frontMatter.published ? (
            <Button
              variant="outline"
              onClick={() => router.push(`/blog/${slug}`)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          ) : null}

          <Button onClick={savePost} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={frontMatter.title}
                onChange={(event) =>
                  setFrontMatter((previous) => ({ ...previous, title: event.target.value }))
                }
                placeholder="Enter post title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                value={frontMatter.excerpt}
                onChange={(event) =>
                  setFrontMatter((previous) => ({ ...previous, excerpt: event.target.value }))
                }
                placeholder="Brief description of the post"
                rows={3}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content (Markdown)
                </Label>
                <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                  <Button
                    variant={!showPreview ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowPreview(false)}
                    className="h-7 px-2"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant={showPreview ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className="h-7 px-2"
                  >
                    <Monitor className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>

              {!showPreview ? (
                <Textarea
                  id="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Write your post content in Markdown..."
                  rows={20}
                  className="font-mono text-sm w-full"
                />
              ) : (
                <div className="border rounded-md p-4 min-h-[500px] bg-background">
                  {content.trim() ? (
                    <MDXContent content={content} />
                  ) : (
                    <p className="text-muted-foreground italic">
                      Start writing to see the preview...
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Publication Status</Label>
              <Button
                variant={frontMatter.published ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  setFrontMatter((previous) => ({
                    ...previous,
                    published: !previous.published,
                  }))
                }
              >
                {frontMatter.published ? 'Published' : 'Draft'}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addTag()
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={addTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>

              {frontMatter.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {frontMatter.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
