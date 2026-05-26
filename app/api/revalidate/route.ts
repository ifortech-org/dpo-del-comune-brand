import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type WebhookPayload = {
  _type?: string;
  slug?: { current?: string } | string;
};

const GLOBAL_TAGS = ["sanity", "sitemap"] as const;
const GLOBAL_PATHS = ["/", "/blog", "/sitemap.xml"] as const;

function revalidateGlobalPaths() {
  for (const path of GLOBAL_PATHS) {
    revalidatePath(path);
  }
}

function revalidateMainPageRoutes() {
  revalidatePath("/", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/[slug]", "page");
  revalidatePath("/blog/[slug]", "page");
}

function revalidateRootLayout() {
  revalidatePath("/", "layout");
}

function getSlug(payload: WebhookPayload): string | undefined {
  if (typeof payload.slug === "string") return payload.slug;
  return payload.slug?.current;
}

export async function POST(request: NextRequest) {
  const secretFromQuery = request.nextUrl.searchParams.get("secret");
  const secretFromHeader = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, message: "Missing SANITY_REVALIDATE_SECRET env var" },
      { status: 500 }
    );
  }

  if (secretFromQuery !== expectedSecret && secretFromHeader !== expectedSecret) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  let payload: WebhookPayload = {};
  try {
    payload = (await request.json()) as WebhookPayload;
  } catch {
    payload = {};
  }

  const slug = getSlug(payload);
  const paths = new Set<string>(GLOBAL_PATHS);
  const tags = new Set<string>(GLOBAL_TAGS);

  if (payload._type === "post" && slug) {
    paths.add(`/blog/${slug}`);
  }

  if (payload._type === "page" && slug) {
    paths.add(slug === "index" ? "/" : `/${slug}`);
  }

  if (payload._type === "post") {
    tags.add("post");
    tags.add("category");
    tags.add("author");
  }

  if (payload._type === "page") {
    tags.add("page");
  }

  if (payload._type === "category") {
    tags.add("category");
    tags.add("post");
  }

  if (payload._type === "author") {
    tags.add("author");
    tags.add("post");
  }

  if (payload._type === "seo") {
    tags.add("seo");
  }

  if (payload._type === "siteLogo") {
    tags.add("siteLogo");
  }

  if (payload._type === "siteColors") {
    tags.add("siteColors");
  }

  revalidateGlobalPaths();

  for (const path of paths) {
    revalidatePath(path);
  }

  if (
    payload._type === "post" ||
    payload._type === "page" ||
    payload._type === "category" ||
    payload._type === "author" ||
    payload._type === "seo" ||
    payload._type === "siteLogo" ||
    payload._type === "siteColors" ||
    !payload._type
  ) {
    revalidateMainPageRoutes();
  }

  if (
    payload._type === "seo" ||
    payload._type === "siteLogo" ||
    payload._type === "siteColors" ||
    !payload._type
  ) {
    revalidateRootLayout();
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({
    ok: true,
    revalidated: Array.from(paths),
    tags: Array.from(tags),
  });
}
