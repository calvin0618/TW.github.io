// 게시글 로더 및 파서

console.log('[post-loader.js] 게시글 로더 로드됨');

(function() {
    // URL 파라미터에서 게시글 ID 가져오기
    function getPostId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    // 게시글 로드 및 렌더링
    async function loadPost() {
        const postId = getPostId();
        const container = document.getElementById('post-container');
        
        if (!postId) {
            container.innerHTML = `
                <div class="error">
                    <h2>게시글 ID가 없습니다</h2>
                    <p>올바른 게시글 링크를 사용해주세요.</p>
                    <a href="index.html">홈으로 돌아가기</a>
                </div>
            `;
            return;
        }
        
        try {
            console.log('[post-loader.js] 게시글 로드 중:', postId);
            
            // posts.json에서 게시글 메타데이터 찾기
            const postsResponse = await fetch('../posts.json');
            if (!postsResponse.ok) {
                throw new Error('posts.json을 찾을 수 없습니다');
            }
            
            const posts = await postsResponse.json();
            const post = posts.find(p => p.id === postId);
            
            if (!post) {
                throw new Error('게시글을 찾을 수 없습니다');
            }
            
            console.log('[post-loader.js] 게시글 메타데이터:', post);
            
            // 마크다운 파일 로드
            const mdResponse = await fetch(`../pages/${post.filename}`);
            if (!mdResponse.ok) {
                throw new Error('마크다운 파일을 찾을 수 없습니다');
            }
            
            const mdContent = await mdResponse.text();
            console.log('[post-loader.js] 마크다운 파일 로드 완료');
            
            // Front Matter 파싱 및 HTML 변환
            const { frontMatter, content } = parseFrontMatter(mdContent);
            const htmlContent = marked.parse(content);
            
            // 페이지 제목 업데이트
            document.title = frontMatter.title || post.title || 'Blog';
            
            // 게시글 렌더링
            container.innerHTML = `
                <article class="post-content">
                    <header>
                        <h1>${frontMatter.title || post.title}</h1>
                        <div class="post-meta">
                            <time datetime="${frontMatter.date || post.date}">
                                ${formatDate(frontMatter.date || post.date)}
                            </time>
                            ${frontMatter.category ? `<span>${frontMatter.category}</span>` : ''}
                        </div>
                        ${frontMatter.tags ? `
                            <div class="post-tags">
                                ${frontMatter.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </header>
                    
                    <div class="post-body">
                        ${htmlContent}
                    </div>
                    
                    <div class="giscus-container">
                        <div id="giscus"></div>
                    </div>
                </article>
            `;
            
            // Giscus 로드
            loadGiscus(postId);
            
            // 코드 하이라이팅
            if (window.Prism) {
                Prism.highlightAll();
            }
            
        } catch (error) {
            console.error('[post-loader.js] 게시글 로드 실패:', error);
            container.innerHTML = `
                <div class="error">
                    <h2>게시글을 불러올 수 없습니다</h2>
                    <p>${error.message}</p>
                    <a href="index.html">홈으로 돌아가기</a>
                </div>
            `;
        }
    }
    
    // Front Matter 파싱
    function parseFrontMatter(content) {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (!match) {
            return { frontMatter: {}, content: content };
        }
        
        const frontMatterStr = match[1];
        const contentStr = match[2];
        
        // YAML 파싱 (간단한 구현)
        const frontMatter = {};
        const lines = frontMatterStr.split('\n');
        
        for (const line of lines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) continue;
            
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // 따옴표 제거
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // 배열 파싱 (태그)
            if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    value = value.slice(1, -1).split(',').map(tag => tag.trim());
                }
            }
            
            frontMatter[key] = value;
        }
        
        console.log('[post-loader.js] Front Matter 파싱 완료:', frontMatter);
        
        return { frontMatter, content: contentStr };
    }
    
    // 날짜 포맷팅
    function formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.warn('[post-loader.js] 날짜 포맷팅 실패:', dateString, error);
            return dateString;
        }
    }
    
    // Giscus 댓글 로드
    function loadGiscus(postId) {
        console.log('[post-loader.js] Giscus 로드 중...');
        
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.setAttribute('data-repo', 'your-username/your-username.github.io');
        script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '1');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'ko');
        script.setAttribute('data-loading', 'lazy');
        
        const giscusContainer = document.getElementById('giscus');
        if (giscusContainer) {
            giscusContainer.appendChild(script);
            console.log('[post-loader.js] Giscus 스크립트 추가됨');
        }
    }
    
    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPost);
    } else {
        loadPost();
    }
})();

