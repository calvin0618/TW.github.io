// 다크/라이트 모드 토글 기능

console.log('[theme.js] 테마 모듈 로드됨');

(function() {
    const THEME_KEY = 'blog-theme';
    const THEME_ATTRIBUTE = 'data-theme';
    
    // 기본 테마는 'light'
    let currentTheme = localStorage.getItem(THEME_KEY) || 'light';
    
    // 초기 테마 설정
    function initTheme() {
        console.log('[theme.js] 초기 테마 설정:', currentTheme);
        document.documentElement.setAttribute(THEME_ATTRIBUTE, currentTheme);
        updateToggleButton();
    }
    
    // 토글 버튼 아이콘 업데이트
    function updateToggleButton() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // 테마 토글
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('[theme.js] 테마 전환:', currentTheme);
        
        document.documentElement.setAttribute(THEME_ATTRIBUTE, currentTheme);
        localStorage.setItem(THEME_KEY, currentTheme);
        updateToggleButton();
    }
    
    // DOM 로드 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // 토글 버튼 이벤트 리스너
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'theme-toggle') {
            toggleTheme();
        }
    });
    
    // 외부에서 사용할 수 있도록 내보내기
    window.themeToggle = toggleTheme;
})();

