import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User, BookOpen, Eye } from "lucide-react";
import type { QuizSummary } from "@/types/QUIZ.types";

interface Props {
  quiz: QuizSummary;
  viewMode?: "grid" | "list";
}

export function FeaturedQuizCard({ quiz, viewMode = "grid" }: Props) {
  return (
    <Link href={`/quiz/solve/${quiz.id}`} className="block h-full">
      <Card
        className="relative h-full overflow-hidden rounded-xl border-2 border-border 
    bg-[hsl(var(--card))] transition-all duration-300 hover:shadow-lg hover:border-primary/20 group
    backdrop-blur-md"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 to-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        <CardHeader className="p-6 pb-3">
          <div className="flex justify-between items-start mb-3">
            <Badge
              variant="outline"
              className="bg-muted/30 text-xs font-medium px-2.5 py-1 backdrop-blur-sm border-border/60"
            >
              {quiz.categoryIcon} {quiz.category}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {quiz.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 pb-3">
          <div className="flex items-center text-sm text-muted-foreground gap-1">
            <User className="h-3.5 w-3.5 mr-1 opacity-70" />
            <span className="font-medium">{quiz.authorName}</span>
            <span className="mx-2 text-muted-foreground/50">•</span>
            <BookOpen className="h-3.5 w-3.5 mr-1 opacity-70" />
            <span>{quiz.questionCount}문제</span>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-3 flex justify-between items-center border-t-2 border-border/60">
          {/* 평점 영역 */}
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(quiz.rating)
                      ? "text-amber-400 fill-amber-400 stroke-amber-500"
                      : i < quiz.rating
                      ? "text-amber-400 fill-amber-400 opacity-50 stroke-amber-500"
                      : "text-muted-foreground/30 stroke-muted-foreground/40"
                  }`}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              ({quiz.ratingCount})
            </span>
          </div>

          {/* 조회수 / 풀이수 / 평균점수 */}
          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 opacity-80" />
              <span>{quiz.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 opacity-80" />
              <span>{quiz.solveCount.toLocaleString()}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
