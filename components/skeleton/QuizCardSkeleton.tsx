import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function QuizCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#FFA07A]/50 group">
      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-4/5" />
      </CardHeader>
      <CardContent className="p-6 pt-0 pb-3">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-24" />
          <span className="mx-2">•</span>
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      <div className="p-6 pt-3 flex justify-between items-center">
        <div className="flex items-center">
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </Card>
  )
}
