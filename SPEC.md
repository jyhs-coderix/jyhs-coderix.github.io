# coderix Portfolio Archive Site Spec

## Overview

`coderix` is a school coding club site focused on preserving club records.

Primary goal:

- Club portfolio and activity archive
- Korean-only content
- Static site hosted on GitHub Pages
- Markdown-based writing workflow
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
---
```

Development posts:

- Require `author`
- Have comments enabled by default

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
github: "https://github.com/..."
date: "2026-05-15"
---
```

Projects:

- Have list pages and detail pages
- Detail body is optional
- Are sorted by newest first
- Each project can link to its own GitHub repository

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
public/images/posts/activity/2026-05/photo-1.jpg
public/images/posts/activity/2026-05/photo-2.jpg
```

Markdown usage:

```md
![5월 활동 사진](/images/posts/activity/2026-05/photo-1.jpg)
```

Image placement in monthly activity records is free-form.

There is no required gallery section in the first version.

## Writing Workflow

Initial writing workflow:

- Members write Markdown through GitHub web UI or local edits
- Changes are submitted through pull requests
- `main` should not be used for direct writes by regular members
- Club operators review and merge PRs

No separate strict frontmatter CI validation in the first version.

Astro Content Collections may still provide basic build-time structure checks, but strict operational rules are reviewed by humans.

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

