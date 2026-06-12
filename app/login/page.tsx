'use client'

import { useState, useTransition, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        })

        const data = await response.json()

        if (response.ok) {
          router.push('/admin/dashboard')
          router.refresh()
        } else {
          setError(data.error || 'Login failed')
        }
      } catch {
        setError('Network error. Please try again.')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-2">Admin Login</h1>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to blog
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(event) =>
              setCredentials((previous) => ({ ...previous, username: event.target.value }))
            }
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(event) =>
              setCredentials((previous) => ({ ...previous, password: event.target.value }))
            }
            required
          />

          {error ? <div className="text-sm text-red-500 text-center">{error}</div> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
