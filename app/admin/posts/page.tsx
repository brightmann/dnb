import { AdminLayout } from '@/components/admin/admin-layout'
import { PostsManager } from '@/components/admin/posts-manager'
import { getAllPosts } from '@/lib/posts'
import { toAdminPostListItem } from '@/lib/post-summary'

export default function AdminPostsPage() {
  const posts = getAllPosts().map(toAdminPostListItem)

  return (
    <AdminLayout title="Posts">
      <PostsManager posts={posts} />
    </AdminLayout>
  )
}
