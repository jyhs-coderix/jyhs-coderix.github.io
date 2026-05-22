#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ISSUE_TYPES = {
  "활동 기록": "activity",
  "개발 글": "dev",
  "프로젝트": "project",
};

const TITLE_PREFIX_TYPES = {
  "[활동 기록]": "activity",
  "[개발 글]": "dev",
  "[프로젝트]": "project",
};

const DRAFT_REQUEST_LABEL = "초안 생성";
const BASE_BRANCH = process.env.BASE_BRANCH ?? "main";
const MAX_IMAGES = 10;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const token = requiredEnv("GITHUB_TOKEN");
const repository = requiredEnv("GITHUB_REPOSITORY");
const issueNumber = Number(requiredEnv("ISSUE_NUMBER"));
const [owner, repo] = repository.split("/");

if (!owner || !repo || !Number.isInteger(issueNumber)) {
  throw new Error("GITHUB_REPOSITORY or ISSUE_NUMBER is invalid.");
}

const apiBase = "https://api.github.com";

async function main() {
  const issue = await api(`/repos/${owner}/${repo}/issues/${issueNumber}`);
  const labels = issue.labels.map((label) => (typeof label === "string" ? label : label.name));

  if (!labels.includes(DRAFT_REQUEST_LABEL)) {
    throw new Error(`Issue #${issueNumber} needs the ${JSON.stringify(DRAFT_REQUEST_LABEL)} label.`);
  }

  const contentType = getIssueContentType(issue);
  const sections = parseSections(issue.body ?? "");
  const draft = await createDraft(contentType, issue, sections);

  await writeDraftFiles(draft.files);
  runBuildCheck();

  const branchName = `content/issue-${issue.number}`;
  const commit = await createCommit(branchName, draft.files, `Create draft content from issue #${issue.number}`);
  await reportBuildStatus(commit.sha, issue.number);
  const pullRequest = await createOrUpdatePullRequest(branchName, draft);
  await commentOnIssue(issue.number, pullRequest, draft);

  console.log(`Created or updated draft PR: ${pullRequest.html_url}`);
}

function getIssueContentType(issue) {
  const issueTypeName = issue.type?.name ?? issue.issue_type?.name ?? issue.type;
  if (ISSUE_TYPES[issueTypeName]) return ISSUE_TYPES[issueTypeName];

  const title = issue.title ?? "";
  const prefix = Object.keys(TITLE_PREFIX_TYPES).find((candidate) => title.startsWith(candidate));
  if (prefix) return TITLE_PREFIX_TYPES[prefix];

  throw new Error(`Issue #${issue.number} needs one title prefix: ${Object.keys(TITLE_PREFIX_TYPES).join(", ")}.`);
}

async function createDraft(contentType, issue, sections) {
  const title = requiredSection(sections, "제목");
  const description = requiredSection(sections, "요약");
  const date = parseDate(requiredSection(sections, "날짜"));
  const authors = parseList(requiredSection(sections, "작성자"));
  const tags = unique(parseCheckedItems(section(sections, "추천 태그")));
  const imageLinks = extractImageLinks(issue.body ?? "");
  const slug = createSlug(contentType, date, issue.number);
  const imageDir = imageDirectory(contentType, date, slug);
  const images = await downloadImages(imageLinks, imageDir);

  if (contentType === "activity") {
    return createActivityDraft({ issue, title, description, date, authors, tags, slug, images, sections });
  }

  if (contentType === "dev") {
    return createDevDraft({ issue, title, description, date, authors, tags, slug, images, sections });
  }

  return createProjectDraft({ issue, title, description, date, authors, tags, slug, images, sections });
}

function createActivityDraft({ issue, title, description, date, authors, tags, slug, images, sections }) {
  const body = markdownSections([
    ["본문", requiredSection(sections, "본문")],
    ["사진", imageMarkdown(images)],
  ]);

  const content = frontmatter([
    ["title", title],
    ["description", description],
    ["category", "활동 기록"],
    ["date", date],
    ["authors", authors],
    ["tags", tags],
    ["comments", true],
    ["draft", false],
    ["sourceIssue", issue.number],
  ]) + body;

  const contentPath = `src/content/posts/activity/${slug}.md`;
  return draftResult({ issue, title, contentPath, content, images, kind: "활동 기록" });
}

function createDevDraft({ issue, title, description, date, authors, tags, slug, images, sections }) {
  const audience = section(sections, "기술 수준 / 대상 독자");
  const author = authors[0];
  const fields = [
    ["title", title],
    ["description", description],
    ["category", "개발 글"],
    ["date", date],
    ["author", author],
  ];

  if (authors.length > 1) fields.push(["authors", authors]);

  const body = markdownSections([
    ["대상 독자", audience],
    ["본문", requiredSection(sections, "본문")],
    ["사진", imageMarkdown(images)],
  ]);

  const content = frontmatter([
    ...fields,
    ["tags", tags],
    ["comments", true],
    ["draft", false],
    ["sourceIssue", issue.number],
  ]) + body;

  const contentPath = `src/content/posts/dev/${slug}.md`;
  return draftResult({ issue, title, contentPath, content, images, kind: "개발 글" });
}

function createProjectDraft({ issue, title, description, date, authors, tags, slug, images, sections }) {
  const links = parseProjectLinks(section(sections, "프로젝트 링크"));
  const body = markdownSections([
    ["본문", requiredSection(sections, "본문")],
    ["사진", imageMarkdown(images)],
  ]);

  const content = frontmatter([
    ["title", title],
    ["description", description],
    ["date", date],
    ["authors", authors],
    ["tags", tags],
    ["links", links],
    ["draft", false],
    ["sourceIssue", issue.number],
  ]) + body;

  const contentPath = `src/content/projects/${slug}.md`;
  return draftResult({ issue, title, contentPath, content, images, kind: "프로젝트" });
}

function draftResult({ issue, title, contentPath, content, images, kind }) {
  return {
    issue,
    title,
    kind,
    contentPath,
    files: [
      { path: contentPath, content, encoding: "utf-8" },
      ...images.map((image) => ({
        path: image.path,
        content: image.buffer.toString("base64"),
        encoding: "base64",
      })),
    ],
    imagePaths: images.map((image) => image.path),
  };
}

function frontmatter(entries) {
  const lines = ["---"];
  for (const [key, value] of entries) {
    lines.push(...yamlField(key, value));
  }
  lines.push("---", "");
  return `${lines.join("\n")}\n`;
}

function yamlField(key, value) {
  if (typeof value === "string") return [`${key}: ${quote(value)}`];
  if (typeof value === "number" || typeof value === "boolean") return [`${key}: ${value}`];

  if (Array.isArray(value)) {
    if (!value.length) return [`${key}: []`];
    if (value.every((item) => typeof item === "string")) {
      return [`${key}:`, ...value.map((item) => `  - ${quote(item)}`)];
    }
    return [
      `${key}:`,
      ...value.flatMap((item) => [
        `  - label: ${quote(item.label)}`,
        `    url: ${quote(item.url)}`,
      ]),
    ];
  }

  throw new Error(`Unsupported frontmatter field: ${key}`);
}

function quote(value) {
  return JSON.stringify(value);
}

function markdownSections(items) {
  const blocks = [];
  for (const [heading, body] of items) {
    const value = clean(body);
    if (value) blocks.push(`## ${heading}\n\n${value}`);
  }
  return `${blocks.join("\n\n")}\n`;
}

function imageMarkdown(images) {
  return images
    .map((image, index) => `![${image.alt || `이미지 ${index + 1}`}](${image.markdownPath})`)
    .join("\n\n");
}

function parseSections(body) {
  const sections = new Map();
  const matches = [...body.matchAll(/^###\s+(.+?)\s*$/gm)];

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const label = current[1].trim();
    const start = current.index + current[0].length;
    const end = next ? next.index : body.length;
    sections.set(label, clean(body.slice(start, end)));
  }

  return sections;
}

function section(sections, label) {
  return sections.get(label) ?? "";
}

function requiredSection(sections, label) {
  const value = section(sections, label);
  if (!value) throw new Error(`Missing required issue section: ${label}`);
  return value;
}

function clean(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized || normalized === "_No response_") return "";
  return normalized;
}

function parseCheckedItems(value) {
  return value
    .split("\n")
    .map((line) => line.match(/^-\s+\[[xX]\]\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function parseList(value) {
  return clean(value)
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDate(value) {
  const date = clean(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Date must use YYYY-MM-DD: ${date}`);
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid date: ${date}`);
  }
  return date;
}

function createSlug(contentType, date, issue) {
  if (contentType === "activity") return `${date.slice(0, 7)}-issue-${issue}`;
  return `${date}-issue-${issue}`;
}

function imageDirectory(contentType, date, slug) {
  if (contentType === "activity") return `public/images/posts/activity/${date.slice(0, 7)}/${slug}`;
  if (contentType === "dev") return `public/images/posts/dev/${slug}`;
  return `public/images/projects/${slug}`;
}

function parseProjectLinks(value) {
  const lines = clean(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 5) throw new Error("Project links are limited to 5.");

  return lines.map((line) => {
    const urlMatch = line.match(/(?:https?:\/\/|www\.|[a-z0-9-]+(?:\.[a-z0-9-]+)+\/)\S+/i);
    if (!urlMatch) throw new Error(`Project link needs a URL: ${line}`);

    const rawUrl = urlMatch[0].replace(/[),.;]+$/, "");
    const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const rawLabel = line.slice(0, urlMatch.index).replace(/[-:–—\s]+$/, "").trim();
    const label = rawLabel || "링크";

    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid project link URL: ${url}`);
    }

    return { label, url };
  });
}

function extractImageLinks(body) {
  const images = [];
  const seen = new Set();
  const regex = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;

  while ((match = regex.exec(body)) !== null) {
    const alt = match[1].trim();
    const url = match[2].trim();
    if (seen.has(url)) continue;
    seen.add(url);
    images.push({ alt, url });
  }

  if (images.length > MAX_IMAGES) {
    throw new Error(`Images are limited to ${MAX_IMAGES} per issue.`);
  }

  return images;
}

async function downloadImages(imageLinks, imageDir) {
  const images = [];

  for (const [index, image] of imageLinks.entries()) {
    const sourceUrl = new URL(image.url);
    if (!isAllowedImageUrl(sourceUrl)) {
      throw new Error(`Only GitHub issue image attachments are supported: ${image.url}`);
    }

    const response = await fetch(image.url, {
      headers: {
        "User-Agent": "coderix-draft-pr-bot",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Failed to download image ${image.url}: ${response.status}`);
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > MAX_IMAGE_BYTES) {
      throw new Error(`Image is larger than ${MAX_IMAGE_BYTES} bytes: ${image.url}`);
    }

    const contentType = response.headers.get("content-type")?.split(";")[0]?.toLowerCase() ?? "";
    const extension = extensionForContentType(contentType);
    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      throw new Error(`Image is larger than ${MAX_IMAGE_BYTES} bytes: ${image.url}`);
    }

    const fileName = `image-${index + 1}.${extension}`;
    const filePath = `${imageDir}/${fileName}`;
    images.push({
      ...image,
      path: filePath,
      markdownPath: `/${filePath.replace(/^public\//, "")}`,
      buffer,
    });
  }

  return images;
}

function isAllowedImageUrl(url) {
  return (
    (url.hostname === "github.com" && url.pathname.startsWith("/user-attachments/assets/")) ||
    url.hostname === "user-images.githubusercontent.com"
  );
}

function extensionForContentType(contentType) {
  const extensions = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  const extension = extensions[contentType];
  if (!extension) throw new Error(`Unsupported image content type: ${contentType}`);
  return extension;
}

async function writeDraftFiles(files) {
  for (const file of files) {
    await mkdir(path.dirname(file.path), { recursive: true });
    await writeFile(file.path, file.encoding === "base64" ? Buffer.from(file.content, "base64") : file.content);
  }
}

function runBuildCheck() {
  if (process.env.SKIP_DRAFT_BUILD === "true") return;
  execFileSync("npm", ["run", "build"], { stdio: "inherit" });
}

async function createCommit(branchName, files, message) {
  const branchRef = await getRef(`heads/${branchName}`).catch((error) => {
    if (error.status === 404) return null;
    throw error;
  });
  const baseRef = await getRef(`heads/${BASE_BRANCH}`);
  const parentSha = branchRef?.object.sha ?? baseRef.object.sha;
  const parentCommit = await api(`/repos/${owner}/${repo}/git/commits/${parentSha}`);
  const tree = await createTree(parentCommit.tree.sha, files);
  const commit = await api(`/repos/${owner}/${repo}/git/commits`, {
    method: "POST",
    body: {
      message,
      tree: tree.sha,
      parents: [parentSha],
    },
  });

  if (branchRef) {
    await api(`/repos/${owner}/${repo}/git/refs/heads/${branchName}`, {
      method: "PATCH",
      body: { sha: commit.sha, force: false },
    });
  } else {
    await api(`/repos/${owner}/${repo}/git/refs`, {
      method: "POST",
      body: { ref: `refs/heads/${branchName}`, sha: commit.sha },
    });
  }

  return commit;
}

async function reportBuildStatus(sha, issue) {
  await api(`/repos/${owner}/${repo}/statuses/${sha}`, {
    method: "POST",
    body: {
      state: "success",
      context: "build",
      description: `npm run build passed while creating draft content from issue #${issue}`,
    },
  });
}

async function createTree(baseTreeSha, files) {
  const tree = [];

  for (const file of files) {
    const blob = await api(`/repos/${owner}/${repo}/git/blobs`, {
      method: "POST",
      body: {
        content: file.content,
        encoding: file.encoding,
      },
    });
    tree.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  return api(`/repos/${owner}/${repo}/git/trees`, {
    method: "POST",
    body: {
      base_tree: baseTreeSha,
      tree,
    },
  });
}

async function createOrUpdatePullRequest(branchName, draft) {
  const head = `${owner}:${branchName}`;
  const existing = await api(`/repos/${owner}/${repo}/pulls?head=${encodeURIComponent(head)}&base=${BASE_BRANCH}&state=open`);
  const title = `게시 초안: ${draft.title} (#${draft.issue.number})`;
  const body = pullRequestBody(draft);

  if (existing.length > 0) {
    return api(`/repos/${owner}/${repo}/pulls/${existing[0].number}`, {
      method: "PATCH",
      body: { title, body },
    });
  }

  return api(`/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    body: {
      title,
      head: branchName,
      base: BASE_BRANCH,
      body,
      draft: true,
    },
  });
}

function pullRequestBody(draft) {
  const imageList = draft.imagePaths.length ? draft.imagePaths.map((image) => `- \`${image}\``).join("\n") : "- 첨부 이미지 없음";
  return `## 자동 생성 초안

- 원본 이슈: #${draft.issue.number}
- 글 종류: ${draft.kind}
- 생성 파일: \`${draft.contentPath}\`

## 이미지

${imageList}

## 게시 전 확인

- [ ] 제목과 설명이 공개 페이지에 적절함
- [ ] 날짜가 실제 활동/작성 날짜와 맞음
- [ ] 작성자 이름 공개가 괜찮음
- [ ] 본문에 개인정보나 민감한 내용이 없음
- [ ] 사진 속 인물 공개/사용 동의가 확인됨
- [ ] 사진 파일명이 정리되어 있고 본문에서 정상 표시됨
- [ ] 태그가 너무 많거나 부정확하지 않음
- [ ] \`npm run build\` 또는 GitHub Actions 빌드가 통과함
- [ ] 배포 후 공개되어도 괜찮음

Closes #${draft.issue.number}
`;
}

async function commentOnIssue(issue, pullRequest, draft) {
  await api(`/repos/${owner}/${repo}/issues/${issue}/comments`, {
    method: "POST",
    body: {
      body: `게시 초안 Draft PR을 만들었습니다: ${pullRequest.html_url}\n\n생성 파일: \`${draft.contentPath}\``,
    },
  });
}

async function getRef(ref) {
  return api(`/repos/${owner}/${repo}/git/ref/${ref}`);
}

async function api(pathname, options = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(`GitHub API ${response.status} ${response.statusText}: ${message}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
