import { defineField, defineType } from "sanity";
import { Files } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";
import seo from "../seo";

export default defineType({
  name: "page",
  type: "document",
  title: "Pagine web",
  icon: Files,
  groups: [
    {
      name: "content",
      title: "Contenuti",
    },
    {
      name: "seo",
      title: "SEO",
    },
    {
      name: "settings",
      title: "Impostazioni",
    },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blocks",
      type: "array",
      group: "content",
      of: [
        { type: "hero-1" },
        { type: "hero-2" },
        { type: "section-header" },
        { type: "split-row" },
        { type: "grid-row" },
        { type: "carousel-1" },
        { type: "carousel-2" },
        { type: "timeline-row" },
        { type: "cta-1" },
        { type: "logo-cloud-1" },
        { type: "faqs" },
        { type: "form-newsletter" },
        { type: "all-posts" },
        { type: "contactform" },
        { type: "call-to-action" },
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: "hero",
              title: "Hero",
              of: ["hero-1", "hero-2"],
            },
            {
              name: "logo-cloud",
              title: "Loghi a scorrimento",
              of: ["logo-cloud-1"],
            },
            {
              name: "section-header",
              title: "Intestazione Sezione",
              of: ["section-header"],
            },
            {
              name: "grid",
              title: "Griglia",
              of: ["grid-row"],
            },
            {
              name: "split",
              title: "Diviso",
              of: ["split-row"],
            },
            {
              name: "carousel",
              title: "Carosello",
              of: ["carousel-1", "carousel-2"],
            },
            {
              name: "timeline",
              title: "Cronologia",
              of: ["timeline-row"],
            },
            {
              name: "cta",
              title: "CTA",
              of: ["cta-1", "call-to-action"],
            },
            {
              name: "faqs",
              title: "Domande Frequenti",
              of: ["faqs"],
            },
            {
              name: "forms",
              title: "Moduli",
              of: ["form-newsletter"],
            },
            {
              name: "all-posts",
              title: "Tutti i Post",
              of: ["all-posts"],
            },
            {
              name: "contactform",
              title: "Modulo di Contatto",
              of: ["contactform"],
            },
          ],
          views: [
            {
              name: "grid",
              previewImageUrl: (block) => `/sanity/preview/${block}.jpg`,
            },
            { name: "list" },
          ],
        },
      },
    }),
    defineField({
      name: "meta_title",
      title: "Titolo Meta",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "meta_description",
      title: "Descrizione Meta",
      type: "text",
      group: "seo",
    }),
    defineField({
      name: "noindex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Immagine Open Graph - [1200x630]",
      type: "image",
      group: "seo",
    }),
    defineField({
      name: "seo",
      title: "SEO avanzato",
      type: "seo",
      group: "seo",
    }),
    orderRankField({ type: "page" }),
  ],
});
