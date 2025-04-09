import { cn } from "@/lib/utils"

interface HeadingProps {
  title: string
  description?: string
  className?: string
}

export function Heading({
  title,
  description,
  className,
}: HeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
} 