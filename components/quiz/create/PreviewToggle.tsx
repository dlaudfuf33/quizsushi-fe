import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Notebook, NotebookPen } from "lucide-react";

interface Props {
  markdownMode: "edit" | "preview";
  onToggleMarkdownMode: () => void;
}

export function PreviewToggle({ markdownMode, onToggleMarkdownMode }: Props) {
  return (
    <Button
      variant="outline"
      onClick={onToggleMarkdownMode}
      className={`flex items-center justify-center gap-2 min-w-[120px] h-9 text-sm border transition-colors duration-200
    ${
      markdownMode === "edit"
        ? "bg-red-100 text-red-600 border-red-200 hover:bg-red-200/50"
        : "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200/50"
    }`}
    >
      {markdownMode === "edit" ? (
        <>
          <EyeClosed className="h-3 w-3" />
          미리 보기
        </>
      ) : (
        <>
          <Eye className="h-3 w-3" />
          미리 보기
        </>
      )}
    </Button>
  );
}
