# coderix Portfolio Archive Site Spec

## Overview

`coderix` is a school coding club site focused on preserving club records.

Primary goal:

- Club portfolio and activity archive
- Korean-only content
- Static site hosted on GitHub Pages
- Site writing page based submission workflow with GitHub issue Markdown output
- Comments for posts through Giscus

Deployment target:

- GitHub org/user: `jyhs-coderix`
- Site repository: `jyhs-coderix/jyhs-coderix.github.io`
- Site URL: `https://jyhs-coderix.github.io/`
- Astro `base`: not needed

The older repository `jyhs-coderix/coderix` can remain as-is and should not be used as the primary site repository.

## Tech Stack

- Astro
- Markdown or MDX content
- Direct CSS, no Tailwind or UI framework
- GitHub Pages
- GitHub Actions deployment
- Giscus comments
- Client-side search

No dark mode in the first version.

## Content Model

### Post Categories

The site has three post categories:

- `activity`: activity records
- `dev`: development posts
- `notice`: notices

Korean display labels:

- `activity`: `활동 기록`
- `dev`: `개발 글`
- `notice`: `공지`

### Activity Records

Monthly activity records are a core content type.

Activity records should follow a fixed writing template:

```md
---
title: "2026년 5월 활동 기록"
description: "coderix의 2026년 5월 활동 정리"
category: "활동 기록"
date: "2026-05-31"
authors: ["홍길동", "김철수"]
tags: ["월간기록"]
comments: true
draft: false
sourceIssue: 12
---

## 이번 달 요약

## 진행한 활동

## 만든 것 / 배운 것

## 기억할 점

## 다음 달 계획
```

Activity records:

- Allow multiple authors through `authors`
- Have comments enabled by default
- May include images anywhere in the body
- May include optional `sourceIssue` for the original submission issue

### Development Posts

Development posts use a single required author.

```md
---
title: "React 상태 관리 정리"
description: "상태 관리 패턴을 정리한 글"
category: "개발 글"
date: "2026-05-15"
author: "홍길동"
tags: ["React"]
comments: true
draft: false
sourceIssue: 13
---
```

Development posts:

- Require `author`
- Have comments enabled by default
- May include `authors` if there are multiple writers
- May include optional `sourceIssue` for the original submission issue

### Notices

Notices are official club posts.

```md
---
title: "6월 정기 모임 안내"
description: "6월 정기 모임 일정 안내"
category: "공지"
date: "2026-06-01"
author: "운영진"
comments: false
---
```

Notices:

- Always use `author: "운영진"`
- Have comments disabled

### Projects

Projects are managed as a separate Markdown collection from posts.

Project cards use the minimum information set:

```md
---
title: "급식 알림 봇"
description: "학교 급식 정보를 알려주는 Discord 봇"
date: "2026-05-15"
authors: ["홍길동", "김철수"]
tags: ["프로젝트", "Python"]
links:
  - label: "GitHub"
    url: "https://github.com/..."
  - label: "시연"
    url: "https://example.com"
draft: false
sourceIssue: 15
---
```

Projects:

- Have list pages and detail pages
- Detail body is optional
- Are sorted by newest first
- Project links are optional
- Each project can include up to 5 links through `links`
- Project links can point to GitHub, demos, videos, documents, slides, or other project resources
- May include optional `sourceIssue` for the original submission issue

No member page is included in the first version.

## URLs

Post URLs use category-based paths:

```txt
/posts/
/posts/activity/
/posts/dev/
/posts/notice/
/posts/activity/2026-05/
/posts/dev/some-topic/
/posts/notice/some-notice/
```

Project URLs:

```txt
/projects/
/projects/some-project/
```

Tag URLs:

```txt
/tags/
/tags/react/
/tags/python/
/tags/월간기록/
```

Search URL:

```txt
/search/
```

## Pages

First version includes:

- Home
- All posts list
- Activity records list
- Development posts list
- Notices list
- Post detail page
- Projects list
- Project detail page
- Tags list
- Tag detail page
- Search page

## Home Page

Home style:

- Club introduction landing page
- Bright campus tone
- Archive previews below the introduction

Hero copy:

```txt
coderix
우리가 만든 것과 배운 것을 기록하는 코딩 동아리
```

Supporting copy:

```txt
프로젝트, 스터디, 월간 활동 기록을 차곡차곡 쌓아가는 coderix의 아카이브입니다.
```

Home preview counts:

- Recent activity records: 2
- Recent development posts: 3
- Recent notices: 2
- Recent projects: 3

## Navigation

Header navigation:

```txt
coderix
활동 기록
개발 글
공지
프로젝트
검색
```

No top-level GitHub link in the first version.

Reason:

- The top GitHub link was intended to point to a representative project repository.
- No representative project URL has been chosen yet.
- Avoid using a temporary or misleading link.

Mobile navigation:

- Simple wrapping navigation
- No hamburger menu in the first version

## Design

Design direction:

- Bright campus tone
- White or very light gray background
- Blue accent color
- Clean cards and readable lists
- Text logo: `coderix`
- Avoid heavy hacker or terminal styling
- No dark mode

CSS approach:

- Direct CSS
- No Tailwind
- No component UI library

Date display:

```txt
2026.05.15
```

Sorting:

- Posts: newest first
- Activity records: newest month first
- Notices: newest first
- Projects: newest first

## Comments

Comments use Giscus.

Giscus setup:

- Comment storage repository: `jyhs-coderix/jyhs-coderix.github.io`
- GitHub Discussions must be enabled on that repository
- Giscus GitHub App must be installed for that repository
- Mapping: `pathname`
- Comments load directly at the bottom of eligible posts

Comment rules:

- Activity records: comments enabled
- Development posts: comments enabled
- Notices: comments disabled

## Search

First version includes client-side search.

Search UI:

- Header has a `검색` navigation link
- Search input and results live on `/search/`

Search index should include:

- Title
- Description
- Category
- Tags
- Author or authors
- Date
- Body excerpt or searchable body text

## Tags

Tags are supported.

Tag behavior:

- Tags are displayed on post lists and detail pages
- Tags are clickable
- Each tag has a detail/list page

## Images

Images are stored in the repository under `public/images/...`.

Recommended path shape:

```txt
public/images/posts/activity/2026-05/2026-05-issue-12/image-1.jpg
public/images/posts/dev/2026-05-15-issue-13/image-1.jpg
public/images/projects/2026-05-15-issue-15/image-1.jpg
```

Markdown usage:

```md
![5월 활동 사진](/images/posts/activity/2026-05/2026-05-issue-12/image-1.jpg)
```

Image placement in monthly activity records is free-form.

There is no required gallery section in the first version.

## Writing Workflow

Default member writing workflow:

```txt
member writes through `/submit/`
-> operator reviews issue
-> operator applies 초안 생성 label
-> GitHub Actions creates Markdown and downloads GitHub issue images
-> GitHub Actions opens a Draft PR
-> operators review the Draft PR checklist
-> PR is marked ready, approved, merged
-> GitHub Pages deploys from main
```

Writing categories:

- `활동 기록`
- `개발 글`
- `프로젝트`

Content categories:

```txt
활동 기록
개발 글
프로젝트
```

The `/submit/` page opens a GitHub issue with the matching title prefix, for example `[개발 글]`.

Automation label:

```txt
초안 생성
```

The `초안 생성` label is attached only by operators or web maintainers after initial content review. GitHub Issue Type is optional for humans and is not required by the automation.

The automation creates `draft: false` content because Draft PR state controls publication before merge. Automatically generated content must include `sourceIssue`.

Draft PR checklist:

- Title and description are appropriate for the public site
- Date matches the actual activity or writing date
- Author names are safe to publish
- Body has no personal or sensitive information
- Photo publication and portrait consent are confirmed
- Images render from repository paths
- Tags are accurate and not excessive
- Build passes
- Content is safe to publish after merge

Image automation rules:

- Only GitHub issue image attachments are downloaded
- External image URLs are not downloaded automatically
- Up to 10 images per issue
- Up to 10 MiB per image
- Supported formats: PNG, JPG, GIF, WebP

Project links:

- The writing page accepts links as `label - URL`, one per line
- Automation converts project links to `links`
- Maximum 5 links per project

Simplified writing fields:

- Activity: `제목`, `요약`, `날짜`, `작성자`, `추천 태그`, `본문`, `이미지 첨부`, `공개 확인`
- Development post: `제목`, `요약`, `날짜`, `작성자`, `추천 태그`, `본문`, `이미지 첨부`, `공개 확인`
- Project: `제목`, `요약`, `날짜`, `작성자`, `추천 태그`, `프로젝트 링크`, `본문`, `이미지 첨부`, `공개 확인`

The automation reads `본문` as the primary body source. Operators can reshape that text into richer Markdown sections inside the generated Draft PR.

GitHub token note:

- `DRAFT_PR_TOKEN` repository secret is recommended for automatic PR creation when branch protection requires pull request workflows.
- Without `DRAFT_PR_TOKEN`, the workflow uses `GITHUB_TOKEN`; this still creates the Draft PR, but GitHub may not trigger follow-up workflows caused by that token.

## Templates

No public sample content should be included in the first version.

Template files should be included for writers:

```txt
templates/activity.md
templates/dev.md
templates/notice.md
templates/project.md
```

These templates are not rendered as site content. They are copied into content folders when writing new posts or projects.

## Deployment

Deployment uses GitHub Actions.

Expected flow:

```txt
push to main
-> GitHub Actions
-> npm ci
-> npm run build
-> upload dist
-> deploy to GitHub Pages
```

For the account site repository `jyhs-coderix.github.io`, Astro does not need a `base` path.

## Deferred Decisions

Decisions intentionally deferred:

- Representative project GitHub URL for the top navigation
- Custom domain
- Member page
- CMS such as Decap CMS
- Dark mode
- Strict custom frontmatter linting
- Advanced image gallery component
- GitHub organization home link
