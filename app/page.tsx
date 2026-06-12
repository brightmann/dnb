import dynamic from 'next/dynamic'
import { getPublishedPosts } from '@/lib/posts'
import { getAllVotes } from '@/lib/votes'
import { buildPostListItems } from '@/lib/post-summary'
import { HomePageSkeleton } from '@/components/blog/home-page-skeleton'

const PlayfulLanding = dynamic(
  () => import('@/components/blog/playful-landing').then((module) => module.PlayfulLanding),
  { loading: () => <HomePageSkeleton /> }
)

export default function HomePage() {
  const posts = getPublishedPosts()
  const votes = getAllVotes()
  const postSummaries = buildPostListItems(posts, votes)

  return <PlayfulLanding posts={postSummaries} />
}
