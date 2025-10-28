// 검색 기능

console.log('[search.js] 검색 모듈 로드됨');

(function() {
    let allPosts = [];
    let searchInput = null;
    let searchResults = null;
    
    // 검색 입력 이벤트 리스너
    function initSearch() {
        searchInput = document.getElementById('search-input');
        searchResults = document.getElementById('search-results');
        
        if (!searchInput) return;
        
        console.log('[search.js] 검색 기능 초기화');
        
        searchInput.addEventListener('input', handleSearch);
    }
    
    // 검색 처리
    function handleSearch(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        console.log('[search.js] 검색어:', query);
        
        const filtered = allPosts.filter(post => {
            const title = (post.title || '').toLowerCase();
            const description = (post.description || '').toLowerCase();
            const tags = (post.tags || []).join(' ').toLowerCase();
            const category = (post.category || '').toLowerCase();
            
            return title.includes(query) ||
                   description.includes(query) ||
                   tags.includes(query) ||
                   category.includes(query);
        });
        
        displaySearchResults(filtered);
    }
    
    // 검색 결과 표시
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">검색 결과가 없습니다.</div>';
            return;
        }
        
        console.log('[search.js] 검색 결과:', results.length, '개');
        
        searchResults.innerHTML = results.slice(0, 5).map(post => `
            <a href="post.html?id=${post.id}" class="search-result-item">
                <h3>${post.title}</h3>
                <p>${post.description || ''}</p>
                <span class="search-result-date">${post.date || ''}</span>
            </a>
        `).join('');
    }
    
    // posts 데이터 설정
    function setPosts(posts) {
        console.log('[search.js] 게시글 데이터 설정:', posts.length, '개');
        allPosts = posts;
    }
    
    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
    
    // 외부에서 사용할 수 있도록 내보내기
    window.setSearchPosts = setPosts;
})();

