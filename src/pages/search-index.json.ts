import {
  getAuthors,
  getPostUrl,
  getProjectUrl,
  getSortedPosts,
  getSortedProjects,
} from "@/lib/content";

export async function GET() {
  const posts = await getSortedPosts();
  const projects = await getSortedProjects();

  const items = [
    ...posts.map((post) => ({
      type: post.data.category,
      title: post.data.title,
      description: post.data.description,
      href: getPostUrl(post),
      date: post.data.date.toISOString(),
      tags: post.data.tags,
      authors: getAuthors(post),
      body: "body" in post ? post.body : "",
    })),
    ...projects.map((project) => ({
      type: "프로젝트",
      title: project.data.title,
      description: project.data.description,
      href: getProjectUrl(project),
      date: project.data.date.toISOString(),
      tags: [],
      authors: [],
      body: "body" in project ? project.body : "",
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

