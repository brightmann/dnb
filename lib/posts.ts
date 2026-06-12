import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostFrontMatter {
  title: string
  date: string
  excerpt: string
  tags: string[]
  published: boolean
  slug: string
}

export interface Post {
  slug: string
  frontMatter: PostFrontMatter
  content: string
}

function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

function parsePostFile(fileName: string): Post {
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const slug = fileName.replace(/\.mdx$/, '')

  return {
    slug,
    frontMatter: {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      published: data.published || false,
      slug,
    },
    content,
  }
}

function readAllPosts(): Post[] {
  ensurePostsDirectory()

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith('.mdx'))
    .map(parsePostFile)
    .toSorted(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
    )
}

export const getAllPosts = cache((): Post[] => readAllPosts())

export const getPublishedPosts = cache((): Post[] =>
  readAllPosts().filter((post) => post.frontMatter.published)
)

export const getPostBySlug = cache((slug: string): Post | null => {
  ensurePostsDirectory()

  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  return parsePostFile(`${slug}.mdx`)
})

export function savePost(slug: string, frontMatter: PostFrontMatter, content: string): void {
  ensurePostsDirectory()

  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContent = matter.stringify(content, frontMatter)
  fs.writeFileSync(fullPath, fileContent)
}

export function deletePost(slug: string): boolean {
  ensurePostsDirectory()

  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
    return true
  }

  return false
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function createPost(title: string, content: string = ''): string {
  const slug = generateSlug(title)
  const date = new Date().toISOString()

  const frontMatter: PostFrontMatter = {
    title,
    date,
    excerpt: '',
    tags: [],
    published: false,
    slug,
  }

  savePost(slug, frontMatter, content)
  return slug
}
