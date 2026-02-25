import Link from "next/link";
import { stegaClean } from "next-sanity";
import { Button } from "@/shared/components/ui/button";
import SectionContainer from "@/shared/components/ui/section-container";
import { ColorVariant, SectionPadding } from "@/sanity.types";
import { cn } from "@/shared/lib/utils";

interface CallToActionProps {
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  buttonText?: string | null;
  buttonSize?: "sm" | "default" | "lg" | null;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  action?: "page" | "contact" | null;
  href?: string | null;
  openInNewTab?: boolean | null;
}

export default function CallToAction({
  padding,
  colorVariant,
  buttonText,
  buttonSize,
  buttonVariant,
  action,
  href,
  openInNewTab,
}: CallToActionProps) {
  const cleanedAction = stegaClean(action) ?? "page";
  const cleanedButtonSize = stegaClean(buttonSize) ?? "default";
  const buttonHref =
    cleanedAction === "contact" ? "#contact-modal" : stegaClean(href) ?? "#";
  const sizeClassName = cn(
    cleanedButtonSize === "sm" && "h-8 px-3 text-xs",
    cleanedButtonSize === "default" && "h-10 px-5 text-sm",
    cleanedButtonSize === "lg" &&
      "h-16 px-12 text-xl font-semibold rounded-xl shadow-lg",
  );

  if (!buttonText) return null;

  return (
    <SectionContainer color={stegaClean(colorVariant)} padding={padding}>
      <div className="flex justify-center">
        <Button
          size={cleanedButtonSize}
          variant={stegaClean(buttonVariant) ?? "default"}
          className={sizeClassName}
          asChild>
          <Link
            href={buttonHref}
            target={cleanedAction === "page" && openInNewTab ? "_blank" : undefined}
            rel={cleanedAction === "page" && openInNewTab ? "noopener" : undefined}>
            {buttonText}
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
