// 모든 페이지 하단에 고정 탭바(홈/투표/조편성/시상품/연락처)를 삽입하는 공통 스크립트
(function () {
    var active = (document.currentScript && document.currentScript.dataset.active) || '';
    var tabs = [
        { key: 'home',    href: '/',         icon: '🏠', label: '홈' },
        { key: 'vote',    href: '/vote/',    icon: '⛳', label: '투표' },
        { key: 'jo',      href: '/jo/',      icon: '👥', label: '조편성' },
        { key: 'prize',   href: '/prize/',   icon: '🏆', label: '시상품' },
        { key: 'contact', href: '/contact/', icon: '📞', label: '연락처' }
    ];

    var nav = document.createElement('nav');
    nav.id = 'bottom-nav';
    nav.style.cssText = 'position:fixed; bottom:0; left:0; right:0; z-index:9999;' +
        'display:flex; background:#ffffff; border-top:1px solid rgba(0,103,71,0.15);' +
        'box-shadow:0 -2px 12px rgba(0,0,0,0.06);' +
        'padding:6px 4px calc(8px + env(safe-area-inset-bottom));';

    tabs.forEach(function (t) {
        var isActive = t.key === active;
        var a = document.createElement('a');
        a.href = t.href;
        a.style.cssText = 'flex:1; text-align:center; text-decoration:none; padding:4px 0;' +
            'color:' + (isActive ? '#006747' : '#9aab9f') + ';';
        a.innerHTML =
            '<span style="display:block; font-size:21px; line-height:1.2;' + (isActive ? '' : ' filter:grayscale(1) opacity(0.55);') + '">' + t.icon + '</span>' +
            '<span style="display:block; font-size:11px; font-weight:' + (isActive ? '800' : '500') + '; margin-top:1px;">' + t.label + '</span>';
        nav.appendChild(a);
    });

    function mount() {
        document.body.appendChild(nav);
        document.body.style.paddingBottom = 'calc(74px + env(safe-area-inset-bottom))';
    }
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount);
})();
