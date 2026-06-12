'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoteButtonsProps {
  postSlug: string
  initialUpvotes: number
}

export function VoteButtons({ postSlug, initialUpvotes }: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    if (isVoting) {
      return
    }

    setIsVoting(true)
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, type: 'up' }),
      })

      const data = await response.json()
      if (response.ok) {
        setUpvotes(data.votes.upvotes)
      }
    } catch (error) {
      console.error('Vote failed:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleVote}
      disabled={isVoting}
      className="flex items-center gap-2 text-muted-foreground hover:text-red-500"
    >
      <Heart className="h-4 w-4" />
      <span className="text-sm">{upvotes}</span>
    </Button>
  )
}
