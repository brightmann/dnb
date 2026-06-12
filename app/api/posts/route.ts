import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getPublishedPosts, createPost } from '@/lib/posts'
import { requireAuth } from '@/lib/auth'
import { toAdminPostListItem } from '@/lib/post-summary'

export async function GET() {
  try {
    const user = await requireAuth()
    const posts = user ? getAllPosts() : getPublishedPosts()
    const summaries = posts.map(toAdminPostListItem)

    return NextResponse.json({ posts: summaries })
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const slug = createPost(title)

    return NextResponse.json({
      success: true,
      slug,
    })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
