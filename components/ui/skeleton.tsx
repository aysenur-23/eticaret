import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Skeleton variants for different components
const SkeletonCard = () => (
  <div className="rounded-lg border bg-card p-6 shadow-sm">
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  </div>
)

const SkeletonInput = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-1/4" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-3 w-1/3" />
  </div>
)

const SkeletonButton = () => (
  <Skeleton className="h-10 w-24" />
)

const SkeletonGrid = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonInput key={i} />
    ))}
  </div>
)

const SkeletonScenarioCards = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="rounded-lg border p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-8 mx-auto rounded" />
          <Skeleton className="h-3 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto rounded-full" />
        </div>
      </div>
    ))}
  </div>
)

// Empty state components
const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="mb-4 text-4xl text-muted-foreground">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
      {description}
    </p>
    {action}
  </div>
)

export {
  Skeleton,
  SkeletonCard,
  SkeletonInput,
  SkeletonButton,
  SkeletonGrid,
  SkeletonScenarioCards,
  EmptyState,
}
