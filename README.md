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

일반 부원은 GitHub Issue Form으로 글 재료를 제출합니다.

- `활동 기록 제보`
- `개발 글 제보`
- `프로젝트 제보`

운영진이 내용을 확인한 뒤 이슈에 `status: draft-requested` 라벨을 붙이면 GitHub Actions가 글 파일과 첨부 이미지를 만들고 Draft PR을 생성합니다. PR에서 제목, 본문, 태그, 사진 공개 동의, 빌드 통과 여부를 확인한 뒤 merge합니다.

자동화용 라벨:

```txt
type: activity
type: dev
type: project
status: draft-requested
```

자동 PR 생성 workflow가 PR 빌드까지 자연스럽게 이어지게 하려면 repository secret `DRAFT_PR_TOKEN`을 설정하는 것을 권장합니다. 없으면 기본 `GITHUB_TOKEN`으로 동작하지만, GitHub 설정에 따라 PR 생성 후 별도 pull request workflow가 자동 실행되지 않을 수 있습니다.

운영진이 직접 글을 작성할 때는 `templates/`의 파일을 복사해서 `src/content/posts/` 아래에 넣습니다.

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

새 프로젝트는 Issue Form으로 제보하거나, 운영진이 `templates/project.md`를 복사해서 `src/content/projects/` 아래에 넣습니다.

```txt
src/content/projects/project-name.md
```

프로젝트 링크는 최대 5개까지 `links` 배열로 관리합니다.

```yaml
links:
  - label: "GitHub"
    url: "https://github.com/jyhs-coderix/example"
  - label: "시연"
    url: "https://example.com"
```

## 이미지

이미지는 `public/images/...` 아래에 저장합니다. Issue Form에 첨부한 이미지는 자동 초안 생성 시 글 단위 폴더로 저장됩니다.

예시:

```txt
public/images/posts/activity/2026-05/2026-05-issue-12/image-1.jpg
public/images/posts/dev/2026-05-15-issue-13/image-1.jpg
public/images/projects/2026-05-15-issue-15/image-1.jpg
```

Markdown에서 사용할 때:

```md
![5월 활동 사진](/images/posts/activity/2026-05/2026-05-issue-12/image-1.jpg)
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
