import type { Post } from '@/lib/posts'
import type { PostVotes, VotesData } from '@/lib/votes'
import { calculateReadingTime } from '@/lib/reading-time'

const EMPTY_VOTES: PostVotes = { upvotes: 0, downvotes: 0, voters: [] }

export interface PostListItem {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime: string
  upvotes: number
}

export interface AdminPostListItem {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  published: boolean
}

export function toPostListItem(post: Post, votes: PostVotes = EMPTY_VOTES): PostListItem {
  return {
    slug: post.slug,
    title: post.frontMatter.title,
    date: post.frontMatter.date,
    excerpt: post.frontMatter.excerpt,
    tags: post.frontMatter.tags,
    readingTime: calculateReadingTime(post.content),
    upvotes: votes.upvotes,
  }
}

export function toAdminPostListItem(post: Post): AdminPostListItem {
  return {
    slug: post.slug,
    title: post.frontMatter.title,
    date: post.frontMatter.date,
    excerpt: post.frontMatter.excerpt,
    tags: post.frontMatter.tags,
    published: post.frontMatter.published,
  }
}

export function buildPostListItems(posts: Post[], votes: VotesData): PostListItem[] {
  return posts.map((post) => toPostListItem(post, votes[post.slug] ?? EMPTY_VOTES))
}
