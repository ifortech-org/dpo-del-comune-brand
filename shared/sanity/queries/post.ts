import { groq } from "next-sanity";

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
  title,
  slug,
  excerpt,
  image{
    ...,
    asset->{
    _id,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
      width,
      height
      }
    }
    },
    alt
  },
  body[]{
    ...,
    _type == "image" => {
    ...,
    asset->{
      _id,
      url,
      mimeType,
      metadata {
      lqip,
      dimensions {
        width,
        height
      }
      }
    }
    }
  },
  author->{
    name,
    image {
    ...,
    asset->{
      _id,
      url,
      mimeType,
      metadata {
      lqip,
      dimensions {
        width,
        height
      }
      }
    },
    alt
    }
  },
  categories[]->{
    _id,
    title,
    slug
  },
  _createdAt,
  _updatedAt,
  publishedAt,
  meta_title,
  meta_description,
  noindex,
  canonicalUrl,
  ogImage {
    asset->{
    _id,
    url,
    metadata {
      dimensions {
      width,
      height
      }
    }
    },
  }
}`;

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc){
  title,
  slug,
  excerpt,
  image{
    asset->{
    _id,
    url,
    mimeType,
    metadata {
      lqip,
      dimensions {
      width,
      height
      }
    }
    },
    alt
  },
  categories[]->{
    _id,
    title,
    slug
  },
}`;

export const POSTS_PAGE_QUERY = groq`{
  "items": *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    ($category == "" || $category in categories[]->title)
  ] | order(publishedAt desc)[$start...$end]{
    title,
    slug,
    excerpt,
    image{
      asset->{
      _id,
      url,
      mimeType,
      metadata {
        lqip,
        dimensions {
        width,
        height
        }
      }
      },
      alt
    },
    categories[]->{
      _id,
      title,
      slug
    },
  },
  "total": count(*[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    ($category == "" || $category in categories[]->title)
  ])
}`;

export const CATEGORIES_QUERY = groq`*[
  _type == "category" &&
  defined(title)
] | order(title asc){
  title,
  slug
}`;

export const POSTS_SLUGS_QUERY = groq`*[_type == "post" && defined(slug) && defined(publishedAt) && publishedAt <= now()]{slug}`;
