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

운영진이 내용을 확인한 뒤 이슈에 `초안 생성` 라벨을 붙이면 GitHub Actions가 글 파일과 첨부 이미지를 만들고 Draft PR을 생성합니다. PR에서 제목, 본문, 태그, 사진 공개 동의, 빌드 통과 여부를 확인한 뒤 merge합니다.

### 부원용 작성 방법

1. GitHub 저장소 상단의 `Issues`를 누릅니다.
2. `New issue`를 누릅니다.
3. 작성하려는 종류를 고릅니다.

```txt
활동 기록 제보: 동아리 활동, 스터디, 행사, 회고
개발 글 제보: 배운 내용, 오류 해결, 기술 정리, 개발 과정
프로젝트 제보: 만든 프로그램, 웹사이트, 앱, 발표 자료, 시연 결과
```

4. 폼을 작성하고 `Submit new issue`를 누릅니다.

폼은 완성된 글을 쓰는 곳이 아니라, 홈페이지 글로 정리할 재료를 제출하는 곳입니다. 문장을 완벽하게 다듬지 않아도 됩니다.

공통 입력 항목:

```txt
제목: 글 제목입니다.
요약: 한 문장으로 짧게 적습니다. 잘 모르겠으면 본문 첫 문장을 적어도 됩니다.
날짜: 활동하거나 글을 쓴 날짜입니다. 예: 2026-05-20
작성자: 여러 명이면 쉼표로 구분합니다.
추천 태그: 맞는 것만 체크합니다. 없으면 체크하지 않아도 됩니다.
본문: 가장 중요한 내용입니다. 편하게 길게 적어도 됩니다.
이미지 첨부: 사진이 있으면 끌어다 놓거나 붙여넣습니다.
공개 확인: 공개 가능한 내용인지 확인하고 체크합니다.
```

활동 기록 본문 예시:

```txt
이번 주에는 Python 기초 문법을 공부했고, 간단한 계산기 프로그램을 만들었습니다.
처음에는 함수가 헷갈렸지만 예제를 따라 하면서 조금 이해됐습니다.
다음 활동에서는 조건문과 반복문을 더 연습해보고 싶습니다.
```

개발 글 본문 예시:

```txt
React에서 버튼을 눌렀을 때 화면이 바뀌는 기능을 만들었습니다.
useState를 사용해서 현재 상태를 저장했고, 클릭 이벤트에서 값을 바꿨습니다.
처음에는 상태가 바로 바뀌지 않는 것처럼 보여서 헷갈렸지만, 렌더링 흐름을 배우게 됐습니다.
```

프로젝트 본문 예시:

```txt
급식 정보를 알려주는 Discord 봇을 만들었습니다.
사용자가 명령어를 입력하면 오늘의 급식 정보를 보여줍니다.
Python과 Discord API를 사용했고, 팀원끼리 기능을 나눠서 만들었습니다.
```

프로젝트 링크는 있으면 아래처럼 적습니다. 최대 5개까지 사용할 수 있습니다.

```txt
GitHub - https://github.com/jyhs-coderix/example
시연 - https://example.com
발표 자료 - https://docs.google.com/...
```

### 복붙용 본문 템플릿

아래 템플릿은 Issue Form의 `본문` 칸에 그대로 복사해서 사용할 수 있습니다. 괄호 안의 설명만 지우고 자기 내용으로 바꾸면 됩니다.

활동 기록:

```txt
이번 활동에서는 (무엇을 했는지 적어주세요).

진행한 내용은 다음과 같습니다.
- (첫 번째 활동)
- (두 번째 활동)
- (세 번째 활동)

만든 것 / 배운 것:
- (만든 결과물이나 배운 내용)
- (새로 알게 된 점)

기억할 점:
(좋았던 점, 어려웠던 점, 다음에 조심할 점을 적어주세요.)

다음 계획:
(다음 활동에서 하고 싶은 일이나 이어서 할 일을 적어주세요.)
```

개발 글:

```txt
이 글에서는 (무엇을 배웠거나 해결했는지 적어주세요).

문제 또는 목표:
(해결하려던 문제나 만들고 싶었던 기능을 적어주세요.)

시도한 방법:
- (첫 번째로 해본 것)
- (두 번째로 해본 것)
- (결과)

배운 점:
(새로 알게 된 점이나 다음에 조심할 점을 적어주세요.)

정리:
(마지막으로 남기고 싶은 말을 적어주세요.)
```

프로젝트:

```txt
이 프로젝트는 (어떤 프로젝트인지 한 문장으로 적어주세요).

주요 기능:
- (첫 번째 기능)
- (두 번째 기능)
- (세 번째 기능)

사용 기술:
- (사용한 언어, 도구, 프레임워크)

제작 과정:
(어떻게 만들었는지, 역할을 나눴다면 누가 무엇을 했는지 적어주세요.)

배운 점:
(만들면서 배운 점이나 다음에 개선하고 싶은 점을 적어주세요.)
```

### 운영진 게시 방법

1. 새 이슈를 확인합니다.
2. 제목, 요약, 날짜, 작성자, 본문이 공개용으로 괜찮은지 봅니다.
3. 사진이 있으면 사진 속 인물의 공개 동의가 있는지 확인합니다.
4. 개인정보, 연락처, 민감한 내용이 있으면 작성자에게 확인하거나 수정합니다.
5. 게시해도 괜찮으면 이슈에 `초안 생성` 라벨을 붙입니다.
6. GitHub Actions가 Draft PR을 만들 때까지 기다립니다.
7. Draft PR에서 생성된 Markdown과 이미지를 확인합니다.
8. 필요하면 PR에서 제목, 본문, 태그, 이미지 설명을 수정합니다.
9. `build` 체크가 통과하면 Draft를 해제하고 merge합니다.

`초안 생성` 라벨은 운영진이나 웹 담당자만 붙입니다. 이 라벨은 "이 이슈를 홈페이지 글 초안으로 만들어도 된다"는 승인 버튼입니다.

Issue Type:

```txt
활동 기록
개발 글
프로젝트
```

위 3개 Issue Type은 GitHub 조직/저장소 설정에서 먼저 만들어져 있어야 합니다. GitHub Issue Form의 `type` 값은 기존 Issue Type이 있을 때 자동으로 붙습니다.

운영진용 라벨:

```txt
초안 생성
```

`활동 기록`, `개발 글`, `프로젝트`는 Issue Form이 자동으로 설정합니다. 운영진은 검수 후 `초안 생성` 라벨만 붙이면 됩니다.

자동 PR 생성 workflow가 PR 빌드까지 자연스럽게 이어지게 하려면 repository secret `DRAFT_PR_TOKEN`을 설정하는 것을 권장합니다. 없으면 기본 `GITHUB_TOKEN`으로 동작하지만, GitHub 설정에 따라 PR 생성 후 별도 pull request workflow가 자동 실행되지 않을 수 있습니다.

운영진이 자동화 없이 직접 글을 작성할 때는 `templates/`의 파일을 복사해서 `src/content/posts/` 아래에 넣습니다.

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
