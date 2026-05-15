# coderix

`coderix`는 우리가 만든 것과 배운 것을 기록하는 학교 코딩 동아리 아카이브입니다.

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 글 작성

공개 샘플 글은 두지 않습니다. 새 글을 작성할 때는 `templates/`의 파일을 복사해서 `src/content/posts/` 아래에 넣습니다.

권장 위치:

```txt
src/content/posts/activity/2026-05.md
src/content/posts/dev/some-topic.md
src/content/posts/notice/some-notice.md
```

카테고리:

- `활동 기록`: 월간 활동 기록, 스터디, 행사, 회고
- `개발 글`: 기술 글, 프로젝트 개발기, 문제 해결 기록
- `공지`: 운영진 공식 안내

공지 글은 `author: "운영진"`과 `comments: false`를 사용합니다.

## 프로젝트 작성

새 프로젝트는 `templates/project.md`를 복사해서 `src/content/projects/` 아래에 넣습니다.

```txt
src/content/projects/project-name.md
```

## 이미지

이미지는 `public/images/...` 아래에 저장합니다.

예시:

```txt
public/images/posts/activity/2026-05/photo-1.jpg
```

Markdown에서 사용할 때:

```md
![5월 활동 사진](/images/posts/activity/2026-05/photo-1.jpg)
```

## 댓글

댓글은 Giscus를 사용합니다. 저장소 `jyhs-coderix/jyhs-coderix.github.io`에서 Discussions를 켜고 Giscus 앱을 설치한 뒤, GitHub Pages 빌드 환경에 아래 값을 추가해야 댓글이 표시됩니다.

```txt
PUBLIC_GISCUS_REPO_ID
PUBLIC_GISCUS_CATEGORY_ID
PUBLIC_GISCUS_CATEGORY
```

`PUBLIC_GISCUS_CATEGORY`는 생략하면 `General`을 사용합니다.

## 배포

`main` 브랜치에 merge되면 GitHub Actions가 Astro를 빌드하고 GitHub Pages에 배포합니다.

