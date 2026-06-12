import { notFound } from 'next/navigation'
import { AdminLayout } from '@/components/admin/admin-layout'
import { PostEditor } from '@/components/admin/post-editor'
import { getPostBySlug } from '@/lib/posts'

interface PostEditorPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostEditorPage({ params }: PostEditorPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <AdminLayout>
      <PostEditor
        slug={slug}
        initialFrontMatter={post.frontMatter}
        initialContent={post.content}
      />
    </AdminLayout>
  )
}
