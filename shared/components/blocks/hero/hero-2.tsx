import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import PortableTextRenderer from "@/shared/components/portable-text-renderer";
import { PAGE_QUERYResult } from "@/sanity.types";
import { urlFor } from "@/shared/sanity/lib/image";

type Hero2Props = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "hero-2" }
>;

export default function Hero2({
  tagLine,
  title,
  body,
  links,
  contactFormButtonText,
  backgroundImage,
}: Hero2Props) {
  const containerClassName = backgroundImage
    ? "dark:bg-background py-20 lg:pt-40 text-center text-white relative"
    : "container dark:bg-background py-20 lg:pt-40 text-center";

  const bgImage = backgroundImage ? urlFor(backgroundImage).url() : undefined;

  const hasActions = (links && links.length > 0) || contactFormButtonText;

  return (
    <div
      className={containerClassName}
      style={{
        backgroundImage: backgroundImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      )}
      {tagLine && (
        <h1 className="leading-[0] font-sans animate-fade-up [animation-delay:100ms] opacity-0">
          <span className="text-base font-semibold">{tagLine}</span>
        </h1>
      )}
      {title && (
        <h2 className="mt-6 font-bold leading-[1.1] text-4xl md:text-5xl lg:text-6xl animate-fade-up [animation-delay:200ms] opacity-0 drop-shadow-lg">
          {title}
        </h2>
      )}
      {body && (
        <div className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up [animation-delay:300ms] opacity-0 drop-shadow-lg">
          <PortableTextRenderer value={body} />
        </div>
      )}
      {hasActions && (
        <div className="mt-10 flex flex-wrap gap-4 justify-center animate-fade-up [animation-delay:400ms] opacity-0">
          {links?.map((link) => (
            <Button key={link.title} variant={stegaClean(link?.buttonVariant)} asChild>
              <Link
                href={link.href as string}
                target={link.target ? "_blank" : undefined}
                rel={link.target ? "noopener" : undefined}>
                {link.title}
              </Link>
            </Button>
          ))}
          {contactFormButtonText && (
            <Button variant="secondary" asChild>
              <Link href="#contact-form">{contactFormButtonText}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
