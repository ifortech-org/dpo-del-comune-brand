import { PAGE_QUERYResult } from "@/sanity.types";
import Hero1 from "@/shared/components/blocks/hero/hero-1";
import Hero2 from "@/shared/components/blocks/hero/hero-2";
import SectionHeader from "@/shared/components/blocks/section-header";
import SplitRow from "@/shared/components/blocks/split/split-row";
import GridRow from "@/shared/components/blocks/grid/grid-row";
import Carousel1 from "@/shared/components/blocks/carousel/carousel-1";
import Carousel2 from "@/shared/components/blocks/carousel/carousel-2";
import TimelineRow from "@/shared/components/blocks/timeline/timeline-row";
import Cta1 from "@/shared/components/blocks/cta/cta-1";
import LogoCloud1 from "@/shared/components/blocks/logo-cloud/logo-cloud-1";
import FAQs from "@/shared/components/blocks/faqs";
import FormNewsletter from "@/shared/components/blocks/forms/newsletter";
import AllPosts from "@/shared/components/blocks/all-posts";
import CallToAction from "@/shared/components/blocks/call-to-action";
import ContactForm from "./contactform";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];

const componentMap: Record<string, React.ComponentType<any>> = {
  "hero-1": Hero1,
  "hero-2": Hero2,
  "section-header": SectionHeader,
  "split-row": SplitRow,
  "grid-row": GridRow,
  "carousel-1": Carousel1,
  "carousel-2": Carousel2,
  "timeline-row": TimelineRow,
  "cta-1": Cta1,
  "logo-cloud-1": LogoCloud1,
  faqs: FAQs,
  "form-newsletter": FormNewsletter,
  "all-posts": AllPosts,
  contactform: ContactForm,
  "call-to-action": CallToAction,
};

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks?.map((block) => {
        const Component = componentMap[block._type];
        if (!Component) {
          // Fallback for development/debugging of new component types
          console.warn(
            `No component implemented for block type: ${block._type}`
          );
          return <div data-type={block._type} key={block._key} />;
        }
        return <Component {...(block as any)} key={block._key} />;
      })}
    </>
  );
}
