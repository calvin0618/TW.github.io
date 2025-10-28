# GitHub Pages 정적 블로그

HTML, CSS, Vanilla JavaScript로 만든 미니멀한 정적 블로그입니다.

## ✨ 주요 기능

- **마크다운 지원**: marked.js로 마크다운을 HTML로 변환
- **코드 하이라이팅**: Prism.js로 코드 블록에 색상 적용
- **다크/라이트 모드**: CSS 변수 기반 테마 전환
- **검색 기능**: 클라이언트 사이드 실시간 검색
- **태그 필터링**: 게시글을 태그별로 필터링
- **댓글 시스템**: Giscus를 통한 GitHub Discussions 연동
- **자동 배포**: GitHub Actions로 posts.json 자동 생성

## 📁 프로젝트 구조

```
/
├── index.html           # 메인 페이지 (게시글 목록)
├── post.html           # 게시글 상세 페이지
├── css/
│   ├── style.css       # 메인 스타일 (다크/라이트 모드)
│   └── prism.css       # 코드 하이라이팅 테마
├── js/
│   ├── app.js          # 메인 애플리케이션 로직
│   ├── post-loader.js  # 마크다운 로딩 및 파싱
│   ├── search.js       # 검색 기능
│   └── theme.js        # 다크/라이트 모드 토글
├── pages/              # 마크다운 게시글 폴더
│   └── example.md      # 예시 게시글
├── .github/workflows/
│   └── generate-posts.yml # posts.json 자동 생성
├── posts.json          # 게시글 메타데이터 (자동 생성)
└── .gitignore
```

## 🚀 배포하기

### 1. GitHub 저장소 설정

1. 새로운 GitHub 저장소를 생성합니다: `{your-username}.github.io`
2. 이 프로젝트를 클론하거나 파일들을 업로드합니다.

### 2. Giscus 댓글 설정 (선택사항)

1. 저장소 **Settings** > **General** > **Features**에서 **Discussions** 활성화
2. https://github.com/apps/giscus 에서 Giscus 앱 설치
3. https://giscus.app/ko 에서 설정 값들을 복사
4. `js/post-loader.js`의 `loadGiscus()` 함수에서 설정 값들을 업데이트:

```javascript
script.setAttribute('data-repo', '{your-username}/{your-username}.github.io');
script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
```

### 3. GitHub Pages 설정

1. 저장소 **Settings** > **Pages**
2. **Source**: "Deploy from a branch"
3. **Branch**: `main` (또는 `gh-pages`)
4. **Save**

### 4. 첫 번째 게시글 작성

1. `pages/` 폴더에 `.md` 파일 생성
2. Front Matter 형식으로 메타데이터 추가:

```markdown
---
title: '게시글 제목'
date: 2025-01-28
tags: ['태그1', '태그2']
category: '카테고리'
description: '간단한 설명'
---

# 내용 작성
```

3. `git add . && git commit -m "Add new post" && git push`
4. GitHub Actions가 자동으로 실행되어 `posts.json` 생성
5. 몇 분 후 https://{your-username}.github.io 에서 확인 가능

## 🛠️ 로컬 개발

브라우저에서 직접 HTML 파일을 열어 테스트할 수 있습니다:

```bash
# Python으로 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js로
npx serve .
```

## 📝 마크다운 작성 가이드

### Front Matter

```markdown
---
title: '게시글 제목'
date: 2025-01-28
tags: ['JavaScript', 'Web']
category: 'Development'
description: '게시글 설명'
---

# 내용 시작
```

### 지원하는 마크다운 문법

- 헤더: `# ## ###`
- **굵은 글씨**와 *기울임꼴*
- `인라인 코드`와 코드 블록
- [링크](url)
- 이미지: `![alt](url)`
- 목록 (순서 있음/없음)
- 인용구: `>`
- 표

## 🎨 커스터마이징

### 스타일 변경

- `css/style.css`에서 CSS 변수 수정
- 반응형 디자인 조정
- 색상 테마 변경

### 기능 추가

- `js/` 폴더의 파일들 수정
- 새로운 JavaScript 모듈 추가
- GitHub Actions 워크플로우 확장

## 📄 라이선스

MIT License - 자유롭게 사용하고 수정하세요.

## 🤝 기여하기

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 문의

이슈나 개선사항이 있으면 GitHub Issues를 사용해주세요!
