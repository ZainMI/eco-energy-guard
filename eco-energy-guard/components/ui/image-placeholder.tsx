import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

export default function ImagePlaceholder({
  label = "Add image here",
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30",
        className
      )}
    >
      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
      <p className="text-center px-3 text-xs font-medium text-muted-foreground/60">
        {label}
      </p>
    </div>
  );
}
