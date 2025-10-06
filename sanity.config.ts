"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./shared/sanity/env";
import { schema } from "./shared/sanity/schema";
import { resolve } from "@/shared/sanity/presentation/resolve";
import { structure } from "./shared/sanity/structure";
import { codeInput } from "@sanity/code-input";
import { simplerColorInput } from "sanity-plugin-simpler-color-input";
import { COLOR_VARIANTS } from "./shared/sanity/schemas/blocks/shared/color-variant";

import { itITLocale } from "@sanity/locale-it-it";

export default defineConfig({
  basePath: "/studio",
  title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "Schema UI",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    itITLocale(),
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve,
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
    simplerColorInput({
      defaultColorFormat: "hex",
      defaultColorList: [
        ...COLOR_VARIANTS.map((variant) => ({
          label: variant.title,
          value: `var(--${variant.value})`,
        })),
        { label: "Personalizzato...", value: "custom" },
      ],
      enableSearch: true,
      showColorValue: true,
    }),
  ],
});
