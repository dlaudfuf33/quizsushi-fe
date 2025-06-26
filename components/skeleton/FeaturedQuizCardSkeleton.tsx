import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

export function FeaturedQuizCardSkeleton() {
  return (
    <Card
      className="relative h-full overflow-hidden rounded-xl border-2 border-border 
      bg-[hsl(var(--card))] transition-all duration-300 group backdrop-blur-md"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="outline"
            className="bg-muted/30 text-xs font-medium px-2.5 py-1 backdrop-blur-sm border-border/60"
          >
            <Skeleton className="h-4 w-20" />
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-2">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-0 pb-3">
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-3 flex justify-between items-center border-t-2 border-border/60">
        <div className="flex items-center">
          <div className="flex items-center mr-2 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 text-muted-foreground/20"
                strokeWidth={1.5}
              />
            ))}
          </div>
          <Skeleton className="h-4 w-6 ml-2" />
        </div>
      </CardFooter>
    </Card>
  );
}
