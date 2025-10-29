// 메인 애플리케이션 로직

console.log('[app.js] 메인 애플리케이션 로드됨');

(function() {
    let allPosts = [];
    let filteredPosts = [];
    let activeTag = 'all';
    
    // posts.json 로드
    async function loadPosts() {
        try {
            console.log('[app.js] 게시글 데이터 로드 중...');
            
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('[app.js] 게시글 데이터 로드 완료:', data.length, '개');
            
            allPosts = data;
            filteredPosts = [...allPosts];
            
            // 검색 모듈에 데이터 설정
            if (window.setSearchPosts) {
                window.setSearchPosts(allPosts);
            }
            
            renderTags();
            renderPosts();
            
        } catch (error) {
            console.error('[app.js] 게시글 로드 실패:', error);
            
            // posts.json이 없을 때 기본 게시글 표시
            const defaultPosts = [
                {
                    file: 'welcome.md',
                    title: '환영합니다!',
                    date: '2025-01-29',
                    description: 'GitHub Pages 정적 블로그에 오신 것을 환영합니다. 이곳에서 다양한 주제의 글들을 만나보세요.',
                    tags: ['블로그', '시작하기', '안내'],
                    category: '일반'
                },
                {
                    file: 'example.md',
                    title: '첫 번째 게시글',
                    date: '2025-01-28',
                    description: 'GitHub Pages 정적 블로그의 첫 번째 게시글입니다. 기본적인 기능들을 소개합니다.',
                    tags: ['JavaScript', 'Web', 'Tutorial'],
                    category: 'Development'
                }
            ];
            
            console.log('[app.js] 기본 게시글 데이터 사용');
            allPosts = defaultPosts;
            filteredPosts = [...allPosts];
            
            if (window.setSearchPosts) {
                window.setSearchPosts(allPosts);
            }
            
            renderTags();
            renderPosts();
        }
    }
    
    // 태그 버튼 렌더링
    function renderTags() {
        const tagsContainer = document.querySelector('.tags-container');
        if (!tagsContainer) return;
        
        // 모든 태그 수집
        const allTags = new Set();
        allPosts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => allTags.add(tag));
            }
        });
        
        console.log('[app.js] 태그 목록:', Array.from(allTags));
        
        // 태그 버튼 생성
        const tagButtons = Array.from(allTags).map(tag => `
            <button class="tag-btn" data-tag="${tag}">${tag}</button>
        `).join('');
        
        // 기존 "전체" 버튼 유지하고 태그 버튼 추가
        tagsContainer.innerHTML = `
            <button class="tag-btn active" data-tag="all">전체</button>
            ${tagButtons}
        `;
        
        // 태그 버튼 이벤트 리스너
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', handleTagClick);
        });
    }
    
    // 태그 클릭 처리
    function handleTagClick(e) {
        const tag = e.target.dataset.tag;
        
        // 활성 버튼 업데이트
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        activeTag = tag;
        filterPosts();
    }
    
    // 게시글 필터링
    function filterPosts() {
        if (activeTag === 'all') {
            filteredPosts = [...allPosts];
        } else {
            filteredPosts = allPosts.filter(post =>
                post.tags && post.tags.includes(activeTag)
            );
        }
        
        console.log('[app.js] 필터링 결과:', activeTag, '->', filteredPosts.length, '개');
        renderPosts();
    }
    
    // 게시글 렌더링
    function renderPosts() {
        const container = document.getElementById('posts-container');
        if (!container) return;
        
        if (filteredPosts.length === 0) {
            container.innerHTML = '<div class="no-posts">게시글이 없습니다.</div>';
            return;
        }
        
        console.log('[app.js] 게시글 렌더링:', filteredPosts.length, '개');
        
        container.innerHTML = filteredPosts.map(post => `
            <article class="post-card">
                <h2><a href="post.html?post=${post.file}">${post.title}</a></h2>
                <div class="post-meta">
                    <time datetime="${post.date}">${formatDate(post.date)}</time>
                    ${post.category ? `<span>${post.category}</span>` : ''}
                </div>
                ${post.description ? `<p>${post.description}</p>` : ''}
                ${post.tags ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </article>
        `).join('');
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
            console.warn('[app.js] 날짜 포맷팅 실패:', dateString, error);
            return dateString;
        }
    }
    
    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPosts);
    } else {
        loadPosts();
    }
    
    // 외부에서 사용할 수 있도록 내보내기
    window.refreshPosts = loadPosts;
})();

