import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug, savePost, deletePost } from '@/lib/posts'
import { requireAuth } from '@/lib/auth'

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (!post.frontMatter.published) {
      const user = await requireAuth()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const { frontMatter, content } = await request.json()

    if (!frontMatter || content === undefined) {
      return NextResponse.json(
        { error: 'Front matter and content are required' },
        { status: 400 }
      )
    }

    savePost(slug, frontMatter, content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const user = await requireAuth()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const success = deletePost(slug)

    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
