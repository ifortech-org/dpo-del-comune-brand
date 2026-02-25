import { groq } from "next-sanity";

// @sanity-typegen-ignore
export const callToActionQuery = groq`
  _type == "call-to-action" => {
    _type,
    _key,
    padding,
    colorVariant,
    buttonText,
    buttonSize,
    buttonVariant,
    action,
    href,
    openInNewTab,
  }
`;
