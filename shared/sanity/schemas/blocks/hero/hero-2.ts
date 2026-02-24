import { defineField, defineType } from "sanity";
import { LayoutTemplate } from "lucide-react";

export default defineType({
  name: "hero-2",
  title: "Hero 2",
  type: "object",
  icon: LayoutTemplate,
  fields: [
    defineField({
      name: "tagLine",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "block-content",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "link" }],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "contactFormButtonText",
      type: "string",
      title: "Contact Form Button Text",
      description:
        "Se valorizzato, mostra un bottone che apre direttamente il form contatti.",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      description: "This image will be used as the background.",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Hero 2",
        subtitle: title,
      };
    },
  },
});
