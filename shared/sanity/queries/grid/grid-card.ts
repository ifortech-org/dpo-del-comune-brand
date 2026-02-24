import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const gridCardQuery = groq`
  _type == "grid-card" => {
    _type,
    _key,
    title,
    titleAlignment,
    titleIcon,
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
    link,
  }
`;
