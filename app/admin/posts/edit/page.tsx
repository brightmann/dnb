import { AdminLayout } from '@/components/admin/admin-layout'
import { PostPicker } from '@/components/admin/post-picker'
import { getAllPosts } from '@/lib/posts'
import { toAdminPostListItem } from '@/lib/post-summary'

export default function PostPickerPage() {
  const posts = getAllPosts().map(toAdminPostListItem)

  return (
    <AdminLayout title="Select Post to Edit">
      <PostPicker posts={posts} />
    </AdminLayout>
  )
}
