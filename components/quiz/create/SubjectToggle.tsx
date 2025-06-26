import { Button } from "@/components/ui/button";
import { Notebook, NotebookPen } from "lucide-react";

interface Props {
  useSubject: boolean;
  onToggleUseSubject: () => void;
}

export function SubjectToggle({ useSubject, onToggleUseSubject }: Props) {
  return (
    <Button
      variant="outline"
      onClick={onToggleUseSubject}
      className={`flex items-center justify-center gap-2 min-w-[120px] h-9 text-sm border transition-colors duration-200
    ${
      useSubject
        ? "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200/50"
        : "bg-red-100 text-red-600 border-red-200 hover:bg-red-200/50"
    }`}
    >
      {useSubject ? (
        <>
          <NotebookPen className="h-3 w-3" />
          과목 분류 ON
        </>
      ) : (
        <>
          <Notebook className="h-3 w-3" />
          과목 분류 OFF
        </>
      )}
    </Button>
  );
}
