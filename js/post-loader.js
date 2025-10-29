// Post loader for individual post pages
(function() {
  'use strict';

  console.log('[post-loader.js] 게시글 로더 모듈 로드됨');

  async function loadPost() {
    console.log('[post-loader.js] 게시글 로드 시작');
    console.log('[post-loader.js] URL 파라미터 확인:', window.location.search);
    const params = new URLSearchParams(window.location.search);
    const postFile = params.get('post');
    
    if (!postFile) {
      console.error('[post-loader.js] URL에 post 파라미터가 없습니다');
      document.getElementById('post-title').textContent = '게시글을 찾을 수 없습니다';
      document.getElementById('post-body').innerHTML = `
        <div class="error-message">
          <p>❌ 게시글 파라미터가 없습니다.</p>
          <p>올바른 URL 형식: <code>post.html?post=example.md</code></p>
        </div>
      `;
      return;
    }

    try {
      console.log('[post-loader.js] 게시글 파일 요청:', postFile);
      console.log('[post-loader.js] 요청 URL:', `pages/${postFile}`);
      const response = await fetch(`pages/${postFile}`);
      console.log('[post-loader.js] 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        console.error('[post-loader.js] HTTP 에러:', response.status, response.statusText);
        throw new Error(`파일을 찾을 수 없습니다 (HTTP ${response.status})`);
      }

      const content = await response.text();
      console.log('[post-loader.js] 파일 로드 성공, 크기:', content.length, 'bytes');
      console.log('[post-loader.js] 파일 내용 미리보기:', content.substring(0, 200));
      
      const { metadata, content: postContent } = parseFrontMatter(content);
      
      console.log('[post-loader.js] 메타데이터:', JSON.stringify(metadata, null, 2));
      console.log('[post-loader.js] 콘텐츠 길이:', postContent.length, 'characters');
      console.log('[post-loader.js] 콘텐츠 미리보기:', postContent.substring(0, 200));
      
      displayPost(metadata, postContent);
      loadGiscus(postFile, metadata.title);
    } catch (error) {
      console.error('[post-loader.js] 게시글 로드 실패:', error);
      const postTitle = document.getElementById('post-title');
      const postBody = document.getElementById('post-body');
      
      if (postTitle) {
        postTitle.textContent = '게시글을 불러올 수 없습니다';
      }
      
      if (postBody) {
        postBody.innerHTML = `
          <div class="error-message">
            <p>❌ 마크다운 파일을 찾을 수 없습니다</p>
            <p>에러 메시지: <code>${error.message}</code></p>
            <p>요청한 파일: <code>pages/${postFile}</code></p>
            <p>확인 사항:</p>
            <ul>
              <li>파일이 존재하는지 확인하세요</li>
              <li>파일 경로가 올바른지 확인하세요</li>
              <li>파일이 pages/ 디렉토리에 있는지 확인하세요</li>
            </ul>
            <a href="index.html" class="back-link">홈으로 돌아가기</a>
          </div>
        `;
      }
    }
  }

  function parseFrontMatter(content) {
    const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    
    if (!frontMatterMatch) {
      return { metadata: {}, content };
    }

    const frontMatter = frontMatterMatch[1];
    const postContent = frontMatterMatch[2];
    const metadata = {};

    console.log('[post-loader.js] Front Matter 내용:', frontMatter);
    console.log('[post-loader.js] 추출된 콘텐츠 길이:', postContent.length);

    // Parse Front Matter
    const lines = frontMatter.split('\n');
    console.log('[post-loader.js] Front Matter 라인들:', lines);

    lines.forEach((line, index) => {
      console.log(`[post-loader.js] 라인 ${index}: "${line}"`);
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        console.log(`[post-loader.js] 파싱: key="${key}", value="${value}"`);

        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Parse arrays (tags)
        if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value.slice(1, -1).split(',')
              .map(tag => tag.trim().replace(/^['"]|['"]$/g, ''));
          }
        }

        metadata[key] = value;
        console.log(`[post-loader.js] 메타데이터 추가: ${key} = ${value}`);
      }
    });

    console.log('[post-loader.js] 최종 메타데이터:', metadata);

    return { metadata, content: postContent };
  }

  function displayPost(metadata, content) {
    // Set title
    document.getElementById('post-title').textContent = metadata.title || '제목 없음';
    document.title = `${metadata.title} - Calvin's Blog`;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && metadata.description) {
      metaDescription.content = metadata.description;
    }

    // Set date and category
    const postDate = document.getElementById('post-date');
    if (postDate) {
      postDate.textContent = `📅 ${metadata.date || ''}`;
    }

    const postCategory = document.getElementById('post-category');
    if (postCategory && metadata.category) {
      postCategory.textContent = `📂 ${metadata.category}`;
    }

    // Set tags
    const postTags = document.getElementById('post-tags');
    if (postTags && metadata.tags) {
      const tags = Array.isArray(metadata.tags) ? metadata.tags : [];
      postTags.innerHTML = tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
    }

    // Render markdown
    const renderer = new marked.Renderer();
    const html = marked.parse(content, { renderer });
    document.getElementById('post-body').innerHTML = html;

    // Highlight code (Prism.js disabled due to CSP)
    // if (window.Prism) {
    //   Prism.highlightAll();
    // }

    console.log('[post-loader.js] 게시글 표시 완료');
  }

  function loadGiscus(postFile, postTitle) {
    console.log('[post-loader.js] Giscus 로드 시작:', postFile);

    const giscusContainer = document.getElementById('giscus-container');
    if (!giscusContainer) {
      console.error('[post-loader.js] Giscus 컨테이너를 찾을 수 없습니다');
      return;
    }

    // Clear previous content
    giscusContainer.innerHTML = '';

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'calvin0618/calvin0618.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOQKgoJQ');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOQKgoJc4CiBy1');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'ko');
    script.crossOrigin = 'anonymous';
    script.async = true;

    giscusContainer.appendChild(script);
    console.log('[post-loader.js] Giscus 스크립트 로드 완료');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPost);
  } else {
    loadPost();
  }
})();

