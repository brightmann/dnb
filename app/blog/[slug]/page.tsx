import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPublishedPosts } from '@/lib/posts'
import { getPostVotes } from '@/lib/votes'
import { VoteButtons } from '@/components/blog/vote-buttons'
import { MDXContent } from '@/components/blog/mdx-content'
import { ArrowLeft } from 'lucide-react'
import { calculateReadingTime } from '@/lib/reading-time'
import { site } from '@/lib/site'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post?.frontMatter.published) {
    notFound()
  }

  const votes = getPostVotes(slug)

  return (
    <div className="min-h-screen">
      <header className="py-6">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-16">
        <article>
          <header className="mb-12">
            <h1 className="text-3xl font-medium mb-4">{post.frontMatter.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <time>
                {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <VoteButtons postSlug={slug} initialUpvotes={votes.upvotes} />
              <p>{calculateReadingTime(post.content)}</p>
            </div>

            {post.frontMatter.excerpt ? (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {post.frontMatter.excerpt}
              </p>
            ) : null}
          </header>

          <MDXContent content={post.content} />
        </article>
      </main>
    </div>
  )
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post not found',
    }
  }

  return {
    title: `${post.frontMatter.title} | ${site.title}`,
    description: post.frontMatter.excerpt,
    openGraph: {
      title: post.frontMatter.title,
      description: post.frontMatter.excerpt,
      type: 'article',
      publishedTime: post.frontMatter.date,
      tags: post.frontMatter.tags,
    },
  }
}
