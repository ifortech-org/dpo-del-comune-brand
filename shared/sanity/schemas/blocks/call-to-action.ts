import { defineField, defineType } from "sanity";
import { MousePointerClick } from "lucide-react";

export default defineType({
  name: "call-to-action",
  type: "object",
  title: "Call To Action",
  description: "Renderizza un bottone con azione personalizzabile.",
  icon: MousePointerClick,
  fields: [
    defineField({
      name: "padding",
      type: "section-padding",
    }),
    defineField({
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    }),
    defineField({
      name: "buttonText",
      type: "string",
      title: "Button Text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonSize",
      type: "string",
      title: "Button Size",
      initialValue: "default",
      options: {
        list: [
          { title: "Piccolo", value: "sm" },
          { title: "Medio", value: "default" },
          { title: "Grande", value: "lg" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonVariant",
      type: "button-variant",
      title: "Button Color/Variant",
    }),
    defineField({
      name: "action",
      type: "string",
      title: "Azione bottone",
      initialValue: "page",
      options: {
        list: [
          { title: "Vai a una pagina/URL", value: "page" },
          { title: "Apri form contatti", value: "contact" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      type: "string",
      title: "Href",
      hidden: ({ parent }: { parent?: { action?: string } }) =>
        parent?.action !== "page",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { action?: string } | undefined;
          if (parent?.action === "page" && !value) {
            return "Inserisci un href quando l'azione è 'Vai a una pagina/URL'.";
          }
          return true;
        }),
    }),
    defineField({
      name: "openInNewTab",
      type: "boolean",
      title: "Open in new tab",
      initialValue: false,
      hidden: ({ parent }: { parent?: { action?: string } }) =>
        parent?.action !== "page",
    }),
  ],
  preview: {
    select: {
      buttonText: "buttonText",
      action: "action",
    },
    prepare({ buttonText, action }) {
      return {
        title: "Call To Action",
        subtitle: `${buttonText || "Senza testo"} • ${
          action === "contact" ? "Apre form contatti" : "Link pagina/URL"
        }`,
      };
    },
  },
});
