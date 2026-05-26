import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import SectionContainer from "@/shared/components/ui/section-container";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import PortableTextRenderer from "@/shared/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";

type Cta1Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "cta-1" }
>;

export default function Cta1({
  padding,
  colorVariant,
  sectionWidth = "default",
  stackAlign = "left",
  tagLine,
  title,
  body,
  links,
}: Cta1Props) {
  const validLinks = (links ?? []).filter(
    (link: any) => typeof link?.href === "string" && link.href.trim().length > 0
  );
  const isNarrow = stegaClean(sectionWidth) === "narrow";
  const align = stegaClean(stackAlign);
  const color = stegaClean(colorVariant);

  return (
    <SectionContainer color={color} padding={padding}>
      <div
        className={cn(
          align === "center" ? "max-w-[48rem] text-center mx-auto" : undefined,
          isNarrow ? "max-w-[48rem] mx-auto" : undefined
        )}>
        <div
          className={cn(color === "primary" ? "text-background" : undefined)}>
          {tagLine && (
            <h1 className="leading-[0] mb-4">
              <span className="text-base font-semibold">{tagLine}</span>
            </h1>
          )}
          <h2 className="mb-4">{title}</h2>
          {body && <PortableTextRenderer value={body} />}
        </div>
        {validLinks.length > 0 && (
          <div
            className={cn(
              "mt-10 flex flex-wrap gap-4",
              align === "center" ? "justify-center" : undefined
            )}>
            {validLinks.map((link: any, index: number) => (
                <Button
                  key={link._key ?? link.href ?? `${link.title ?? "link"}-${index}`}
                  variant={stegaClean(link?.buttonVariant)}
                  asChild>
                  <Link
                    href={link.href}
                    target={link.target ? "_blank" : undefined}
                    rel={link.target ? "noopener" : undefined}>
                    {link.title}
                  </Link>
                </Button>
              ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
