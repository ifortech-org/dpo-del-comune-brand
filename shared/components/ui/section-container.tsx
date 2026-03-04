import { cn } from "@/shared/lib/utils";
import { SectionPadding, ColorVariant } from "@/sanity.types";

interface SectionContainerProps {
  color?: ColorVariant | null;
  padding?: SectionPadding | null;
  children: React.ReactNode;
  className?: string;
}

export default function SectionContainer({
  color = "background",
  padding,
  children,
  className,
}: SectionContainerProps) {
  const textColorClass =
    color === "primary"
      ? "text-primary-foreground"
      : color === "secondary"
        ? "text-secondary-foreground"
        : "";

  return (
    <div
      className={cn(
        `bg-${color} relative`,
        textColorClass,
        padding?.top ? "pt-16 xl:pt-20" : "pt-4",
        padding?.bottom ? "pb-16 xl:pb-20" : "pb-4",
        className,
      )}>
      <div className="container">{children}</div>
    </div>
  );
}
