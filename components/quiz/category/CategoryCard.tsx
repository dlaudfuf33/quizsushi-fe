import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { IntroductionCategory } from "@/types/category.types";

interface Props {
  category: IntroductionCategory;
}

export function CategoryCard({ category }: Props) {
  return (
    <Link href={`/quiz/categories/?id=${category.id}`}>
      <Card
        className="h-full overflow-hidden transition-all duration-200 
      hover:shadow-md hover:border-[#FFA07A]/50 group
      "
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{category.icon}</div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-[#FFA07A] transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
            {category.count}개 문제
          </Badge>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#FFA07A] transition-colors" />
        </CardFooter>
      </Card>
    </Link>
  );
}
