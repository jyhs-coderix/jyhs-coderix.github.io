import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;
export type Project = CollectionEntry<"projects">;

export const categories = {
  activity: { label: "활동 기록", href: "/posts/activity/" },
  dev: { label: "개발 글", href: "/posts/dev/" },
  notice: { label: "공지", href: "/posts/notice/" },
} as const;

export type CategorySlug = keyof typeof categories;

const labelToSlug = Object.fromEntries(
  Object.entries(categories).map(([slug, meta]) => [meta.label, slug]),
) as Record<string, CategorySlug>;

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll(". ", ".")
    .replace(/\.$/, "");
}

export function getCategorySlug(post: Post): CategorySlug {
  return labelToSlug[post.data.category] ?? "dev";
}

export function getPostSlug(post: Post) {
  const category = getCategorySlug(post);
  const prefix = `${category}/`;
  return post.id.startsWith(prefix) ? post.id.slice(prefix.length) : post.id;
}

export function getPostUrl(post: Post) {
  return `/posts/${getCategorySlug(post)}/${getPostSlug(post)}/`;
}

export function getProjectUrl(project: Project) {
  return `/projects/${project.id}/`;
}

export function getAuthors(post: Post) {
  if (post.data.authors?.length) return post.data.authors;
  if (post.data.author) return [post.data.author];
  return [];
}

export async function getSortedPosts() {
  const posts = await getCollection("posts");
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPostsByCategory(category: CategorySlug) {
  const posts = await getSortedPosts();
  return posts.filter((post) => getCategorySlug(post) === category);
}

export async function getSortedProjects() {
  const projects = await getCollection("projects");
  return projects
    .filter((project) => !project.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function uniqueTags(posts: Post[]) {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) =>
    a.localeCompare(b, "ko"),
  );
}

export function shouldShowComments(post: Post) {
  if (typeof post.data.comments === "boolean") return post.data.comments;
  return post.data.category !== "공지";
}
