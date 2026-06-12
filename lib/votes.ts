import fs from 'fs'
import path from 'path'
import { cache } from 'react'

const votesFile = path.join(process.cwd(), 'content/votes/post-votes.json')

export interface PostVotes {
  upvotes: number
  downvotes: number
  voters: string[]
}

export interface VotesData {
  [postSlug: string]: PostVotes
}

function ensureVotesFile() {
  const votesDir = path.dirname(votesFile)
  if (!fs.existsSync(votesDir)) {
    fs.mkdirSync(votesDir, { recursive: true })
  }

  if (!fs.existsSync(votesFile)) {
    fs.writeFileSync(votesFile, JSON.stringify({}))
  }
}

function readVotes(): VotesData {
  ensureVotesFile()

  try {
    const data = fs.readFileSync(votesFile, 'utf8')
    return JSON.parse(data) as VotesData
  } catch {
    return {}
  }
}

function writeVotes(votes: VotesData): void {
  ensureVotesFile()
  fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2))
}

export const getPostVotes = cache((postSlug: string): PostVotes => {
  const allVotes = readVotes()
  return allVotes[postSlug] ?? { upvotes: 0, downvotes: 0, voters: [] }
})

export const getAllVotes = cache((): VotesData => readVotes())

export function voteOnPost(
  postSlug: string,
  voteType: 'up' | 'down',
  voterIdentifier: string
): { success: boolean; votes: PostVotes; message?: string } {
  const allVotes = readVotes()
  const currentVotes = allVotes[postSlug] ?? { upvotes: 0, downvotes: 0, voters: [] }

  if (currentVotes.voters.includes(voterIdentifier)) {
    return {
      success: false,
      votes: currentVotes,
      message: 'You have already voted on this post',
    }
  }

  if (voteType === 'up') {
    currentVotes.upvotes += 1
  } else {
    currentVotes.downvotes += 1
  }

  currentVotes.voters.push(voterIdentifier)
  allVotes[postSlug] = currentVotes

  writeVotes(allVotes)

  return {
    success: true,
    votes: currentVotes,
  }
}

export function getVoterIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0] : 'unknown'
}
