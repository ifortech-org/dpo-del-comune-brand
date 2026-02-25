import { defineField, defineType } from "sanity";
import { LayoutGrid } from "lucide-react";

export default defineType({
  name: "grid-card",
  type: "object",
  icon: LayoutGrid,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "titleAlignment",
      type: "string",
      title: "Title Alignment",
      initialValue: "center",
      options: {
        list: [
          { title: "Sinistra", value: "left" },
          { title: "Centro", value: "center" },
          { title: "Destra", value: "right" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleIcon",
      type: "string",
      title: "Title Icon (Lucide name)",
      description: "Es. Rocket, Mail, ArrowRight",
    }),
    defineField({
      name: "excerpt",
      type: "text",
    }),
    defineField({
      name: "image",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "link",
      type: "link",
    }),
    defineField({
      name: "showButton",
      type: "boolean",
      title: "Mostra bottone",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: "Grid Card",
        subtitle: title || "No title",
        media,
      };
    },
  },
});
