import { Skeleton } from '@/components/ui/skeleton'

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-9 w-80 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
        </div>
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
