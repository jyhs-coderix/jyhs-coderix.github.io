# AGENTS.md

## Project

This repository is the `coderix` school coding club archive site.

- Site repository: `jyhs-coderix/jyhs-coderix.github.io`
- Production URL: `https://jyhs-coderix.github.io/`
- Framework: Astro
- Deployment: GitHub Pages through GitHub Actions
- Language: Korean-only public UI/content
- Styling: direct CSS in `src/styles/global.css`

Use `SPEC.md` as the product contract when behavior or content structure is unclear.

## Commands

Run from the repository root:

```bash
npm install
npm run dev
npm run build
```

Before finishing any code, routing, content-schema, workflow, or UI change, run:

```bash
npm run build
```

For dependency/security checks, use:

```bash
npm audit --omit=dev
```

## Git And PR Rules

`main` is protected by a repository ruleset.

- Do not work directly on `main` for normal changes.
- Create a branch for each change.
- Push the branch and open a PR into `main`.
- PRs must pass the GitHub Actions `build` check.
- PRs require at least one approval before merge.
- Do not force-push protected branches.
- Do not delete protected branches.

Repository-local Git author:

```txt
hanyulhui <ssddert95@gmail.com>
```

Use this author for commits in this repository unless the user explicitly requests a different identity.

## Content Structure

Posts live in `src/content/posts/`.

Use these category folders:

```txt
src/content/posts/activity/
src/content/posts/dev/
src/content/posts/notice/
```

Projects live in:

```txt
src/content/projects/
```

Do not add public sample content just to test layouts. The placeholder files are private `draft: true` entries used only to keep empty collections quiet.

Use templates from:

```txt
templates/activity.md
templates/dev.md
templates/notice.md
templates/project.md
```

## Frontmatter Rules

Activity records:

```yaml
category: "활동 기록"
authors: ["작성자"]
comments: true
```

Development posts:

```yaml
category: "개발 글"
author: "작성자"
comments: true
```

Notices:

```yaml
category: "공지"
author: "운영진"
comments: false
```

Projects:

```yaml
title: "프로젝트 이름"
description: "프로젝트 설명"
github: "https://github.com/..."
date: "YYYY-MM-DD"
```

Dates in frontmatter use `YYYY-MM-DD`. Public date display is `YYYY.MM.DD`.

## Routing

The site uses category-based post URLs.

Expected URL shapes:

```txt
/posts/
/posts/activity/
/posts/dev/
/posts/notice/
/posts/activity/2026-05/
/posts/dev/some-topic/
/posts/notice/some-notice/
/projects/
/projects/some-project/
/tags/
/tags/some-tag/
/search/
```

When changing content routing, update helpers in `src/lib/content.ts` and verify generated pages with `npm run build`.

## Comments

Comments use Giscus.

- Giscus repository: `jyhs-coderix/jyhs-coderix.github.io`
- Discussion category: `General`
- Mapping: `pathname`
- Theme: `light`
- Language: `ko`

Build-time variables are stored as GitHub Actions repository Variables:

```txt
PUBLIC_GISCUS_REPO_ID
PUBLIC_GISCUS_CATEGORY
PUBLIC_GISCUS_CATEGORY_ID
```

Do not hard-code these IDs into source files unless the user explicitly asks.

## Design Rules

Keep the first version aligned with the existing design direction:

- Bright campus tone
- White or very light gray background
- Blue accent
- Text logo: `coderix`
- No dark mode
- No Tailwind or UI component library
- Mobile nav wraps naturally; no hamburger menu for now

Avoid broad redesigns unless the user asks for one.

## Images

Store images under `public/images/...`.

Recommended shape:

```txt
public/images/posts/activity/2026-05/photo-1.jpg
```

Markdown path:

```md
![설명](/images/posts/activity/2026-05/photo-1.jpg)
```

## Deployment Notes

The repository is an account site repo, so Astro does not need a `base` path.

Keep:

```js
site: "https://jyhs-coderix.github.io"
```

Do not change this to a project-site `/coderix` base unless the repository or deployment target changes.

