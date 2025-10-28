---
title: '첫 번째 게시글'
date: 2025-01-28
tags: ['JavaScript', 'Web', 'Tutorial']
category: 'Development'
description: 'GitHub Pages 정적 블로그의 첫 번째 게시글입니다. 기본적인 기능들을 소개합니다.'
---

# 첫 번째 게시글

안녕하세요! GitHub Pages 정적 블로그에 오신 것을 환영합니다.

이 블로그는 **HTML**, **CSS**, **Vanilla JavaScript**로 만들어졌으며, 마크다운 파일을 통해 쉽게 게시글을 작성할 수 있습니다.

## 주요 기능

### 1. 마크다운 지원
이 게시글처럼 마크다운 문법을 사용하여 작성할 수 있습니다.

- **굵은 글씨**와 *기울임꼴*
- [링크](https://github.com)
- 코드 블록

### 2. 코드 하이라이팅

```javascript
function helloWorld() {
    console.log('Hello, World!');
    return 'Welcome to my blog';
}
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))  # 55
```

### 3. 다크/라이트 모드

화면 상단의 버튼을 클릭하여 다크 모드와 라이트 모드를 전환할 수 있습니다.

### 4. 태그 시스템

게시글에는 태그를 추가할 수 있으며, 메인 페이지에서 태그별로 필터링할 수 있습니다.

## 목록 예시

### 순서 있는 목록
1. HTML 구조 생성
2. CSS 스타일링
3. JavaScript 기능 구현
4. GitHub Actions 설정

### 순서 없는 목록
- 마크다운 파싱
- Front Matter 지원
- 검색 기능
- 댓글 시스템 (Giscus)

## 표 예시

| 기능 | 상태 | 설명 |
|------|------|------|
| 마크다운 | ✅ | marked.js 사용 |
| 코드 하이라이팅 | ✅ | Prism.js 사용 |
| 검색 | ✅ | 클라이언트 사이드 |
| 댓글 | ✅ | Giscus 통합 |

## 인용구

> "코드는 시가 아니다. 작동하는 것이 중요하다." - Grace Hopper

## 이미지 지원

이미지는 마크다운 문법으로 추가할 수 있습니다:

![GitHub Pages](https://pages.github.com/images/home-page-hero-macbook.png)

## 다음 단계

이제 여러분의 아이디어를 담은 게시글을 작성해보세요!

- Front Matter에 `title`, `date`, `tags`, `category`, `description`을 설정하세요
- 마크다운 문법을 사용하여 내용을 작성하세요
- `git push`하여 자동 배포를 확인하세요

더 자세한 정보는 [프로젝트 문서](https://github.com/your-username/your-username.github.io)를 참고하세요.

