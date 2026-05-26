import { client } from "../lib/client";
import { siteColorsQuery } from "../queries/siteColors";

export async function fetchSiteColors() {
  return await client.fetch(siteColorsQuery, {}, {
    next: {
      tags: ["siteColors"],
    },
    perspective: "published",
    stega: false,
  });
}
