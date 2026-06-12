'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Clock, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { VoteButtons } from '@/components/blog/vote-buttons'
import type { PostListItem } from '@/lib/post-summary'

interface LandingPostProps {
  post: PostListItem
  onTagSelect: (tag: string) => void
}

export const LandingPost = memo(function LandingPost({ post, onTagSelect }: LandingPostProps) {
  return (
    <article className="group [content-visibility:auto] [contain-intrinsic-size:auto_200px]">
      <div className="flex items-start gap-4">
        <VoteButtons
          postSlug={post.slug}
          initialUpvotes={post.upvotes}
        />

        <div className="flex-1">
          <h3 className="text-xl font-medium mb-2">
            <Link
              href={`/blog/${post.slug}`}
              className="group-hover:text-muted-foreground transition-colors"
            >
              {post.title}
            </Link>
          </h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {post.readingTime}
            </div>
          </div>

          {post.excerpt ? (
            <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
          ) : null}

          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onTagSelect(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
})
