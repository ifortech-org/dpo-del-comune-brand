import { groq } from "next-sanity";

export const siteLogoQuery = groq`*[_type == "siteLogo"] | order(_createdAt desc)[0]{
  logoLight,
  logoDark,
  alt
}`;
