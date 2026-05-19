import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["활동 기록", "개발 글", "공지"]),
    date: z.coerce.date(),
    author: z.string().optional(),
    authors: z.array(z.string()).optional(),
    tags: z.array(z.string()).default([]),
    comments: z.boolean().optional(),
    draft: z.boolean().default(false),
    sourceIssue: z.number().int().positive().optional(),
  }),
});

const projectLink = z.object({
  label: z.string(),
  url: z.url(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    authors: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    links: z.array(projectLink).max(5).default([]),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    sourceIssue: z.number().int().positive().optional(),
  }),
});

export const collections = { posts, projects };
